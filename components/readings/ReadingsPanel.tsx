"use client";

import type {
  ReadingEdge,
  ReadingItem,
  ReadingSource,
  ReadingThread,
} from "@/content/readings";
import styles from "./readings.module.css";

type ReadingsPanelProps = {
  selected: ReadingItem | ReadingSource | null;
  readings: ReadingItem[];
  threads: ReadingThread[];
  edges: ReadingEdge[];
  onClose: () => void;
};

function isReading(item: ReadingItem | ReadingSource): item is ReadingItem {
  return "author" in item;
}

export function ReadingsPanel({
  selected,
  readings,
  threads,
  edges,
  onClose,
}: ReadingsPanelProps) {
  const connectedReadings =
    selected && !isReading(selected)
      ? edges
          .filter((edge) => edge.source === selected.id)
          .map((edge) => readings.find((reading) => reading.id === edge.target))
          .filter((reading): reading is ReadingItem => Boolean(reading))
      : [];

  return (
    <aside
      className={`${styles.detailPanel} card ${selected ? styles.detailPanelSelected : ""}`}
      aria-label="Reading details"
      aria-live="polite"
    >
      <div className={styles.detailHeading}>
        <p className="eyebrow">Details</p>
        {selected && (
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close details"
          >
            ×
          </button>
        )}
      </div>
      {!selected ? (
        <div className={styles.emptyState}>
          <h2>Select a reading or source</h2>
          <p>
            Choose a node on the map to see context, themes, sources, and
            related readings.
          </p>
        </div>
      ) : isReading(selected) ? (
        <div className={styles.detailContent}>
          <p className={styles.detailType}>Reading</p>
          <h2>{selected.title}</h2>
          {selected.localizedTitle && (
            <p className={styles.localizedTitle}>{selected.localizedTitle}</p>
          )}
          <p className={styles.author}>{selected.author}</p>
          <dl className={styles.metadata}>
            <div>
              <dt>Format</dt>
              <dd>{selected.format}</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>{selected.status.replace("-", " ")}</dd>
            </div>
            {selected.dateLabel && (
              <div>
                <dt>Date</dt>
                <dd>{selected.dateLabel}</dd>
              </div>
            )}
            {selected.rating !== undefined && (
              <div>
                <dt>Rating</dt>
                <dd>{selected.rating} / 5</dd>
              </div>
            )}
            {selected.discoveredVia && (
              <div>
                <dt>Discovered via</dt>
                <dd>{selected.discoveredVia}</dd>
              </div>
            )}
          </dl>
          <DetailTags label="Themes" values={selected.themes} />
          <DetailTags
            label="Threads"
            values={(selected.threadIds ?? [])
              .map(
                (threadId) =>
                  threads.find((thread) => thread.id === threadId)?.title,
              )
              .filter((value): value is string => Boolean(value))}
          />
          {selected.whyRead && (
            <DetailCopy label="Why I read it" text={selected.whyRead} />
          )}
          {selected.note && <DetailCopy label="Note" text={selected.note} />}
          {selected.relatedTo.length > 0 && (
            <DetailTags
              label="Related readings"
              values={selected.relatedTo
                .map(
                  (id) => readings.find((reading) => reading.id === id)?.title,
                )
                .filter((value): value is string => Boolean(value))}
            />
          )}
        </div>
      ) : (
        <div className={styles.detailContent}>
          <p className={styles.detailType}>Source</p>
          <h2>{selected.title}</h2>
          <p className={styles.sourceType}>
            {selected.sourceType.replaceAll("-", " ")}
          </p>
          {selected.description && (
            <p className={styles.detailDescription}>{selected.description}</p>
          )}
          <DetailTags
            label="Connected readings"
            values={connectedReadings.map(({ title }) => title)}
          />
        </div>
      )}
    </aside>
  );
}

function DetailTags({ label, values }: { label: string; values: string[] }) {
  if (values.length === 0) return null;
  return (
    <section className={styles.detailSection}>
      <h3>{label}</h3>
      <ul className={styles.detailChips}>
        {values.map((value) => (
          <li key={value}>{value}</li>
        ))}
      </ul>
    </section>
  );
}

function DetailCopy({ label, text }: { label: string; text: string }) {
  return (
    <section className={styles.detailSection}>
      <h3>{label}</h3>
      <p className={styles.detailDescription}>{text}</p>
    </section>
  );
}
