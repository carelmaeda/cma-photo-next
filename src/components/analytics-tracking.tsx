"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { track } from "@/lib/analytics";
import { EVENTS } from "@/lib/analytics-events";

const SCROLL_MILESTONES = [25, 50, 75, 100] as const;

/**
 * Site-wide event tracking, mounted once in the root layout. Two passive,
 * additive listeners — they observe the existing DOM and never alter behaviour:
 *
 *  1. Delegated clicks/submits — navigation links (any element marked
 *     data-ga-nav), and opt-in filter (data-ga-filter) / search
 *     (form[data-ga-search]) controls.
 *  2. Scroll depth — 25/50/75/100% milestones on pages long enough to scroll,
 *     re-armed on every route change.
 */
export function AnalyticsTracking() {
  const pathname = usePathname();

  // 1 — delegated interaction tracking (mounts once for the app lifetime).
  useEffect(() => {
    function onClick(event: MouseEvent) {
      const target = event.target as Element | null;
      if (!target) return;

      // Navigation link clicks.
      const anchor = target.closest("a[href]") as HTMLAnchorElement | null;
      const navRegion = anchor?.closest("[data-ga-nav]") as HTMLElement | null;
      if (anchor && navRegion) {
        track(EVENTS.navigationClick, {
          link_text: (anchor.textContent || "").trim().slice(0, 100) || "(no text)",
          link_url: anchor.getAttribute("href") || "",
          nav_location: navRegion.dataset.gaNav || "unknown",
        });
      }

      // Filter / facet controls (opt-in via data-ga-filter).
      const filter = target.closest("[data-ga-filter]") as HTMLElement | null;
      if (filter) {
        track(EVENTS.filterSelect, {
          filter_type: filter.dataset.gaFilter || "unknown",
          filter_value:
            filter.dataset.gaFilterValue ||
            (filter.textContent || "").trim().slice(0, 100),
        });
      }
    }

    function onSubmit(event: SubmitEvent) {
      const form = (event.target as Element | null)?.closest(
        "form[data-ga-search]"
      ) as HTMLFormElement | null;
      if (!form) return;
      const input = form.querySelector(
        'input[type="search"], input[name="q"], input[name="search"]'
      ) as HTMLInputElement | null;
      track(EVENTS.search, {
        search_term: (input?.value || "").trim().slice(0, 100),
      });
    }

    document.addEventListener("click", onClick, { capture: true });
    document.addEventListener("submit", onSubmit, { capture: true });
    return () => {
      document.removeEventListener("click", onClick, { capture: true });
      document.removeEventListener("submit", onSubmit, { capture: true });
    };
  }, []);

  // 2 — scroll depth, re-armed per page.
  useEffect(() => {
    const fired = new Set<number>();

    function evaluate() {
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      // Only "long" pages qualify — needs ~60% of a viewport of scroll room.
      if (scrollable < window.innerHeight * 0.6) return;

      const percent = Math.min(
        100,
        Math.round((window.scrollY / scrollable) * 100)
      );
      for (const milestone of SCROLL_MILESTONES) {
        if (percent >= milestone && !fired.has(milestone)) {
          fired.add(milestone);
          track(EVENTS.scrollDepth, {
            percent_scrolled: milestone,
            page_path: pathname,
          });
        }
      }
    }

    let ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        evaluate();
        ticking = false;
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    evaluate(); // catch already-scrolled / short pages on mount
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  return null;
}
