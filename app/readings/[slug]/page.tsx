import { notFound } from "next/navigation";
import { PageShell } from "@/components/PageShell";
import { readingNodes } from "@/content/readings";
import { createMetadata } from "@/lib/seo";

export function generateStaticParams() { return readingNodes.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const node = readingNodes.find((item) => item.slug === slug);
  return node ? createMetadata({ title: node.title, description: node.description, path: `/readings/${node.slug}` }) : {};
}

export default async function ReadingDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const node = readingNodes.find((item) => item.slug === slug);
  if (!node) notFound();
  return <PageShell title={node.title} intro={node.description}><div className="experience-list"><article className="card experience-card"><p className="eyebrow">{node.type} · {node.subtitle}</p><p>This route is ready for longer notes. The reading data currently lives in <code>content/readings.ts</code>.</p></article></div></PageShell>;
}
