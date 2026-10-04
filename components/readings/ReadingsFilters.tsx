"use client";

import type { ReadingThread } from "@/content/readings";
import type { ReadingGraphFilter } from "@/lib/readings/graph";
import styles from "./readings.module.css";

type ReadingsFiltersProps = {
  threads: ReadingThread[];
  filter: ReadingGraphFilter;
  showSourceNodes: boolean;
  onFilterChange: (filter: ReadingGraphFilter) => void;
  onShowSourceNodesChange: (show: boolean) => void;
};

const formatChips = [
  { label: "All", value: "" },
  { label: "Books", value: "book" },
  { label: "Essays", value: "essay" },
  { label: "Articles", value: "article" },
];
const threadLabels: Record<string, string> = {
  "fatigue-modernity-attention": "Fatigue / modernity",
  "women-body-interiority": "Women / body",
  "alienation-shame-fragmentation": "Alienation / shame",
  "death-mortality-wisdom": "Death / mortality",
  "turkish-literature-memory": "Turkish literature",
};

export function ReadingsFilters({
  threads,
  filter,
  showSourceNodes,
  onFilterChange,
  onShowSourceNodesChange,
}: ReadingsFiltersProps) {
  const update = (key: keyof ReadingGraphFilter, value: string) =>
    onFilterChange({ ...filter, [key]: value });
  const toggleThread = (value: string) =>
    update("thread", filter.thread === value ? "" : value);

  return (
    <section className={`${styles.filters} card`} aria-label="Filter readings">
      <div className={styles.filterTopline}>
        <label className={styles.searchField}>
          <span>Search readings</span>
          <input
            type="search"
            value={filter.search}
            onChange={(event) => update("search", event.target.value)}
            placeholder="Search by title, author, source, theme..."
          />
        </label>
        <label className={styles.sourceToggle}>
          <input
            type="checkbox"
            checked={showSourceNodes}
            onChange={(event) => onShowSourceNodesChange(event.target.checked)}
          />
          <span>Show sources</span>
        </label>
      </div>

      <div className={styles.filterRow} role="group" aria-label="Format">
        <span className={styles.filterLabel}>Format</span>
        <div className={styles.chips}>
          {formatChips.map((chip) => (
            <button
              key={chip.label}
              type="button"
              className={`${styles.chip} ${filter.format === chip.value ? styles.activeChip : ""}`}
              aria-pressed={filter.format === chip.value}
              onClick={() => update("format", chip.value)}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.filterRow} role="group" aria-label="Threads">
        <span className={styles.filterLabel}>Threads</span>
        <div className={styles.chips}>
          {threads.map((thread) => (
            <button
              key={thread.id}
              type="button"
              className={`${styles.chip} ${filter.thread === thread.id ? styles.activeChip : ""}`}
              aria-pressed={filter.thread === thread.id}
              onClick={() => toggleThread(thread.id)}
            >
              {threadLabels[thread.id] ?? thread.title}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
