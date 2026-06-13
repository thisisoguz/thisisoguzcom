import { PageShell } from "@/components/PageShell";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({ title: "Readings", description: "A personal map of books, authors, concepts and the connections between them.", path: "/readings" });

export default function ReadingsPage() {
  return <PageShell wide className="readings-page" title="Readings" intro="Not a rating shelf. This is a small map of books, questions and ideas, including the paths that connect them.">{null}</PageShell>;
}
