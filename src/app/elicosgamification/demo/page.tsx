import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "H5P Game 1 (placeholder) | Jimmy Nicholas",
  description:
    "Placeholder for an interactive activity embedded in Rise 360 at a stable URL.",
  robots: { index: false, follow: false },
};

export default function H5pGame1PlaceholderPage() {
  return (
    <section data-rise-card role="region" aria-label="Activity placeholder">
      <h1>Activity placeholder</h1>
      <p>
          This page is a stable target for a Rise 360 embed at{" "}
        <code>/elicosgamification/demo</code>. The real H5P or interactive
        content will replace this copy at the same URL - no change needed in
        Rise.
      </p>
      <p data-rise-note>
        If you see this outside a course preview, you can ignore it.
      </p>
    </section>
  );
}
