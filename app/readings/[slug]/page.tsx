import { notFound } from "next/navigation";
import { PageShell } from "@/components/PageShell";
import { readingThreads, readings } from "@/content/readings";
import { createMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return readings.map(({ id }) => ({ slug: id }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const reading = readings.find((item) => item.id === slug);
  return reading
    ? createMetadata({
        title: reading.title,
        description: `${reading.title} by ${reading.author}.`,
        path: `/readings/${reading.id}`,
      })
    : {};
}

export default async function ReadingDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const reading = readings.find((item) => item.id === slug);
  if (!reading) notFound();
  const threads = (reading.threadIds ?? [])
    .map(
      (threadId) =>
        readingThreads.find((thread) => thread.id === threadId)?.title,
    )
    .filter((title): title is string => Boolean(title));
  return (
    <PageShell
      title={reading.title}
      intro={`${reading.format} by ${reading.author}.`}
    >
      <div className="experience-list">
        <article className="card experience-card">
          {reading.localizedTitle && (
            <p className="experience-meta">{reading.localizedTitle}</p>
          )}
          <p className="experience-meta">
            {reading.status.replace("-", " ")}
            {reading.dateLabel ? ` · ${reading.dateLabel}` : ""}
          </p>
          {reading.discoveredVia && (
            <p>Discovered via {reading.discoveredVia}.</p>
          )}
          {reading.whyRead && <p>{reading.whyRead}</p>}
          {reading.note && <p>{reading.note}</p>}
          {threads.length > 0 && (
            <p className="experience-meta">Threads: {threads.join(" · ")}</p>
          )}
          {reading.themes.length > 0 && (
            <p className="experience-meta">
              Themes: {reading.themes.join(" · ")}
            </p>
          )}
        </article>
      </div>
    </PageShell>
  );
}
