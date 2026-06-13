import { Card } from "@/components/Card";
import type { ReadingNode } from "@/content/readings";

const statusLabels = { read: "Read", reading: "Reading", want_to_read: "Want to read" } as const;

export function ReadingCard({ node }: { node: ReadingNode }) {
  return (
    <Card className="reading-card">
      <div className="reading-card-top"><span className="reading-type">{node.type}</span><span className="status-pill">{statusLabels[node.status]}</span></div>
      <h2>{node.title}</h2>
      <p className="reading-subtitle">{node.subtitle}</p>
      <p>{node.description}</p>
      <ul className="tag-list" aria-label="Reading tags">{node.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>
    </Card>
  );
}
