import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
  readingEdges,
  readingThreads,
  readings,
  type ReadingItem,
  type ReadingSource,
} from "@/content/readings";
import { ReadingsPanel } from "@/components/readings/ReadingsPanel";

describe("ReadingsPanel", () => {
  it("shows available reading metadata, related links, and invokes close", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const reading: ReadingItem = {
      ...readings.find((item) => item.id === "the-vegetarian")!,
      dateLabel: "May 2026",
      rating: 4,
      whyRead: "A club selection that opened a new thread.",
      note: "A note retained from the reading archive.",
    };
    render(
      <ReadingsPanel
        selected={reading}
        readings={[reading, ...readings]}
        threads={readingThreads}
        edges={readingEdges}
        onClose={onClose}
      />,
    );

    expect(screen.getByText("May 2026")).toBeInTheDocument();
    expect(screen.getByText("4 / 5")).toBeInTheDocument();
    expect(
      screen.getByText("A club selection that opened a new thread."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("A note retained from the reading archive."),
    ).toBeInTheDocument();
    expect(screen.getByText("The Dark Daughter")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Close details" }));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("shows only existing connected readings for a source and handles empty source metadata", () => {
    const source: ReadingSource = {
      id: "one-off-source",
      title: "A Friend",
      sourceType: "friend",
    };
    render(
      <ReadingsPanel
        selected={source}
        readings={readings}
        threads={readingThreads}
        edges={[
          {
            source: source.id,
            target: "the-vegetarian",
            relation: "source-to-reading",
          },
          {
            source: source.id,
            target: "missing-reading",
            relation: "source-to-reading",
          },
        ]}
        onClose={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("heading", { level: 2, name: "A Friend" }),
    ).toBeInTheDocument();
    expect(screen.getByText("friend")).toBeInTheDocument();
    expect(screen.getByText("The Vegetarian")).toBeInTheDocument();
    expect(screen.queryByText("missing-reading")).not.toBeInTheDocument();
  });

  it("shows the empty instruction when there is no selection", () => {
    render(
      <ReadingsPanel
        selected={null}
        readings={readings}
        threads={readingThreads}
        edges={readingEdges}
        onClose={vi.fn()}
      />,
    );
    expect(
      screen.getByRole("heading", { name: "Select a reading or source" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Choose a node on the map to see context, themes, sources, and related readings.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Close details" }),
    ).not.toBeInTheDocument();
  });

  it("labels a selected item as a Reading or Source", () => {
    const reading = readings[0];
    const { rerender } = render(
      <ReadingsPanel
        selected={reading}
        readings={readings}
        threads={readingThreads}
        edges={readingEdges}
        onClose={vi.fn()}
      />,
    );
    expect(screen.getByText("Reading")).toBeInTheDocument();
    rerender(
      <ReadingsPanel
        selected={{ id: "book-club", title: "A club", sourceType: "book-club" }}
        readings={readings}
        threads={readingThreads}
        edges={[]}
        onClose={vi.fn()}
      />,
    );
    expect(screen.getByText("Source")).toBeInTheDocument();
  });
});
