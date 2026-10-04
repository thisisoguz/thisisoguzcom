import { PageShell } from "@/components/PageShell";
import { ReadingsGraph } from "@/components/readings/ReadingsGraph";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Readings",
  description:
    "A personal map of readings, sources, and the paths that led from one idea to another.",
  path: "/readings",
});

export default function ReadingsPage() {
  return (
    <PageShell
      wide
      className="readings-page"
      title="Readings"
      intro="A personal map of readings, sources, and the paths that led from one idea to another."
    >
      <ReadingsGraph />
    </PageShell>
  );
}
