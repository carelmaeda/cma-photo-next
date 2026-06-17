import { cn } from "@/lib/utils";

interface FrameCaptionProps {
  frame?: string;
  city?: string;
  camera?: string;
  recipe?: string;
  className?: string;
}

/**
 * Film-edge caption — the one decorative device on the site (SPEC.md §3).
 * Renders e.g.  FR-014 · PARIS · GFX100RF · VANILLA SUMMER
 */
export function FrameCaption({
  frame,
  city,
  camera,
  recipe,
  className,
}: FrameCaptionProps) {
  const parts = [frame, city, camera, recipe].filter(Boolean);
  if (parts.length === 0) return null;

  return (
    <p
      className={cn(
        "border-t border-line pt-1.5 text-cap font-mono tracking-frame text-warm uppercase",
        className
      )}
    >
      {parts.join(" · ")}
    </p>
  );
}
