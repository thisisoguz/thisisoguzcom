import { readingEdges, readingNodes } from "@/content/readings";

const positions: Record<string, { x: number; y: number }> = {
  missed: { x: 24, y: 20 }, frustration: { x: 58, y: 15 }, satisfaction: { x: 78, y: 35 },
  othello: { x: 14, y: 61 }, lear: { x: 45, y: 76 }, freud: { x: 29, y: 43 },
  unconscious: { x: 58, y: 50 }, breakups: { x: 72, y: 74 },
};

export function ReadingMap() {
  return (
    <section className="reading-map" aria-labelledby="map-heading">
      <div className="map-heading"><div><p className="eyebrow">Connections</p><h2 id="map-heading">A small reading map</h2></div><p>Why one thing led to another.</p></div>
      <div className="map-canvas">
        <svg aria-hidden="true" viewBox="0 0 100 100" preserveAspectRatio="none">
          {readingEdges.map((edge) => { const source = positions[edge.sourceId]; const target = positions[edge.targetId]; return <line key={edge.id} x1={source.x} y1={source.y} x2={target.x} y2={target.y} strokeWidth={Math.max(0.5, edge.strength * 0.35)} />; })}
        </svg>
        {readingNodes.map((node) => <span key={node.id} className={`bubble bubble--${node.type}`} style={{ left: `${positions[node.id].x}%`, top: `${positions[node.id].y}%` }} title={node.description}>{node.title}</span>)}
      </div>
      <ul className="connection-notes">{readingEdges.slice(0, 3).map((edge) => <li key={edge.id}>{edge.note}</li>)}</ul>
    </section>
  );
}
