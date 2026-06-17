import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import { CldImage } from "@/components/cld-image";
import { FrameCaption } from "@/components/frame-caption";
import { CodeBlock } from "@/components/code-block";

/**
 * Photo for use inside MDX guides:
 *   <GuidePhoto publicId="v.../Braga/_DSF5843_fjmaju.jpg" alt="..." city="Braga" />
 * Only real Cloudinary publicIds — never invent them.
 */
function GuidePhoto({
  publicId,
  alt,
  city,
  camera,
  recipe,
}: {
  publicId: string;
  alt: string;
  city?: string;
  camera?: string;
  recipe?: string;
}) {
  return (
    <figure className="my-10">
      <CldImage
        photo={{ publicId, alt }}
        width={1600}
        height={1067}
        crop="limit"
        sizes="(min-width: 768px) 680px, 100vw"
        className="w-full"
      />
      <FrameCaption city={city} camera={camera} recipe={recipe} className="mt-3" />
    </figure>
  );
}

export const mdxComponents: MDXComponents = {
  GuidePhoto,
  h2: (props) => (
    <h2 className="font-display text-2xl font-semibold mt-12 mb-4" {...props} />
  ),
  h3: (props) => (
    <h3 className="font-display text-xl font-semibold mt-10 mb-3" {...props} />
  ),
  p: (props) => <p className="my-4 leading-relaxed" {...props} />,
  ul: (props) => (
    <ul className="my-4 list-disc space-y-2 pl-5 marker:text-ink-soft" {...props} />
  ),
  ol: (props) => (
    <ol className="my-4 list-decimal space-y-2 pl-5 marker:text-ink-soft" {...props} />
  ),
  blockquote: (props) => (
    <blockquote
      className="my-6 border-l border-indigo pl-4 text-ink-soft"
      {...props}
    />
  ),
  hr: () => <hr className="my-10 border-line" />,
  // Fenced code / settings blocks get a copy button + GA4 copy tracking.
  pre: (props) => <CodeBlock {...props} />,
  a: ({ href = "", ...props }) =>
    href.startsWith("/") ? (
      <Link
        href={href}
        className="underline underline-offset-2 hover:text-indigo"
        {...props}
      />
    ) : (
      <a
        href={href}
        className="underline underline-offset-2 hover:text-indigo"
        rel="noopener"
        {...props}
      />
    ),
  table: (props) => (
    <div className="my-6 overflow-x-auto">
      <table className="w-full border-collapse text-sm" {...props} />
    </div>
  ),
  th: (props) => (
    <th
      className="border-b border-line py-2 pr-4 text-left text-cap font-mono tracking-frame uppercase font-normal text-ink-soft"
      {...props}
    />
  ),
  td: (props) => <td className="border-b border-line py-2 pr-4" {...props} />,
};
