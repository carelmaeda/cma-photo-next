/**
 * GA4 event registry — the single source of truth for every custom event the
 * site sends. `track()` (src/lib/analytics.ts) emits these; the reference page
 * at /analytics-events renders this catalog so it can never drift from reality.
 *
 * GA4 naming conventions applied throughout:
 *  - event + parameter names are snake_case, ≤ 40 chars
 *  - parameter string values are kept ≤ 100 chars (GA4 truncates beyond that)
 *  - `search` is GA4's *recommended* event (uses the reserved `search_term` param)
 *  - the built-in Enhanced-Measurement `scroll` event only fires once at 90%, so
 *    the four-step depth tracker uses a distinct custom name, `scroll_depth`,
 *    to avoid colliding with it.
 */

export const EVENTS = {
  /** Click on any chrome navigation link (header, logo, footer, mobile menu). */
  navigationClick: "navigation_click",
  /** Cart drawer opened from the header. */
  cartOpen: "cart_open",
  /** Mobile navigation sheet opened. */
  mobileMenuOpen: "mobile_menu_open",
  /** A code/settings sample was copied to the clipboard. */
  copyCodeSample: "copy_code_sample",
  /** GA4 recommended event — site search submitted. */
  search: "search",
  /** A listing filter/facet was selected. */
  filterSelect: "filter_select",
  /** A 25/50/75/100% scroll milestone was reached on a long page. */
  scrollDepth: "scroll_depth",
} as const;

export type GAEventName = (typeof EVENTS)[keyof typeof EVENTS];

export type EventStatus = "active" | "ready";

export interface EventParamDoc {
  key: string;
  example: string;
  note?: string;
}

export interface EventDoc {
  name: GAEventName;
  category: "Navigation" | "Content" | "Listings" | "Engagement";
  trigger: string;
  where: string;
  params: EventParamDoc[];
  status: EventStatus;
  notes?: string;
}

/**
 * `active`  = a UI element that exists today fires it.
 * `ready`   = instrumentation is wired and GA4-correct, but the matching UI does
 *             not exist on the site yet (it fires the moment that UI is added —
 *             see the opt-in note). Marked so a reviewer isn't misled.
 */
export const eventCatalog: EventDoc[] = [
  {
    name: EVENTS.navigationClick,
    category: "Navigation",
    trigger: "Click on a navigation link",
    where: "Header nav, logo, footer links, mobile menu sheet",
    status: "active",
    params: [
      { key: "link_text", example: "Gallery", note: "Visible label, trimmed to 100 chars" },
      { key: "link_url", example: "/gallery", note: "href as authored" },
      {
        key: "nav_location",
        example: "header",
        note: "header | logo | footer | mobile_menu — the data-ga-nav region clicked",
      },
    ],
  },
  {
    name: EVENTS.cartOpen,
    category: "Navigation",
    trigger: "Cart drawer opened",
    where: "Header cart button (CartWidget)",
    status: "active",
    params: [{ key: "item_count", example: "2", note: "Items in cart when opened" }],
  },
  {
    name: EVENTS.mobileMenuOpen,
    category: "Navigation",
    trigger: "Mobile menu sheet opened",
    where: "Header menu button, < md breakpoint (NavSheet)",
    status: "active",
    params: [],
  },
  {
    name: EVENTS.scrollDepth,
    category: "Engagement",
    trigger: "Reader crosses a 25 / 50 / 75 / 100% scroll milestone",
    where: "Any page tall enough to scroll meaningfully (blog posts, albums, About)",
    status: "active",
    params: [
      { key: "percent_scrolled", example: "50", note: "25 | 50 | 75 | 100, fired once each" },
      { key: "page_path", example: "/blog/why-i-shoot-jpeg-only" },
    ],
    notes:
      "Short pages never fire (guarded: needs ~60% of a viewport of scroll). Re-armed on every route change.",
  },
  {
    name: EVENTS.copyCodeSample,
    category: "Content",
    trigger: "Copy button clicked on a code / settings block",
    where: "Fenced code blocks rendered in MDX guides (CodeBlock)",
    status: "active",
    params: [
      { key: "snippet_length", example: "184", note: "Characters copied" },
      { key: "page_path", example: "/blog/what-are-fujifilm-recipes" },
    ],
    notes:
      "The copy button is attached to the MDX code-block render path, so any ``` fenced block in a guide gets it automatically. No guide ships a code block today, so it stays dormant until one does.",
  },
  {
    name: EVENTS.search,
    category: "Listings",
    trigger: "Search form submitted",
    where: "Any <form data-ga-search> (no search UI exists yet)",
    status: "ready",
    params: [{ key: "search_term", example: "amsterdam", note: "GA4 reserved param" }],
    notes:
      "Opt-in: add data-ga-search to a search <form> containing an input[type=search] (or name=\"q\"/\"search\"). The delegated listener then emits this automatically.",
  },
  {
    name: EVENTS.filterSelect,
    category: "Listings",
    trigger: "A filter / facet control is selected",
    where: "Any element with data-ga-filter (no filter UI exists yet)",
    status: "ready",
    params: [
      { key: "filter_type", example: "country", note: "data-ga-filter value" },
      { key: "filter_value", example: "italy", note: "data-ga-filter-value, or the control's text" },
    ],
    notes:
      'Opt-in: add data-ga-filter="<type>" (and optionally data-ga-filter-value) to a filter control. Useful if Gallery or the gear list on About ever gains client-side filtering.',
  },
];
