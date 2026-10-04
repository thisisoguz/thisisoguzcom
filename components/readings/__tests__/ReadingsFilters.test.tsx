import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { readingThreads } from "@/content/readings";
import {
  emptyReadingGraphFilter,
  type ReadingGraphFilter,
} from "@/lib/readings/graph";
import { ReadingsFilters } from "@/components/readings/ReadingsFilters";

describe("ReadingsFilters", () => {
  it("shows only search, format chips, the five main threads, and Show sources", () => {
    render(
      <ReadingsFilters
        threads={readingThreads}
        filter={emptyReadingGraphFilter}
        showSourceNodes
        onFilterChange={vi.fn()}
        onShowSourceNodesChange={vi.fn()}
      />,
    );
    expect(
      screen.getByRole("searchbox", { name: "Search readings" }),
    ).toHaveAttribute(
      "placeholder",
      "Search by title, author, source, theme...",
    );
    expect(screen.getByRole("button", { name: "All" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "Books" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Essays" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Articles" }),
    ).toBeInTheDocument();
    for (const label of [
      "Fatigue / modernity",
      "Women / body",
      "Alienation / shame",
      "Death / mortality",
      "Turkish literature",
    ]) {
      expect(screen.getByRole("button", { name: label })).toBeInTheDocument();
    }
    expect(
      screen.getByRole("checkbox", { name: "Show sources" }),
    ).toBeChecked();
    expect(
      screen.queryByRole("group", { name: "Sources" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("group", { name: "Popular themes" }),
    ).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Status")).not.toBeInTheDocument();
  });

  it("emits controlled search, format, and thread filter changes", async () => {
    const user = userEvent.setup();
    const onFilterChange = vi.fn();
    render(<ControlledFilters onFilterChange={onFilterChange} />);
    await user.type(
      screen.getByRole("searchbox", { name: "Search readings" }),
      "Han Kang",
    );
    expect(onFilterChange).toHaveBeenLastCalledWith({
      ...emptyReadingGraphFilter,
      search: "Han Kang",
    });
    await user.click(screen.getByRole("button", { name: "Essays" }));
    expect(onFilterChange).toHaveBeenLastCalledWith({
      ...emptyReadingGraphFilter,
      search: "Han Kang",
      format: "essay",
    });
    await user.click(screen.getByRole("button", { name: "Women / body" }));
    expect(onFilterChange).toHaveBeenLastCalledWith({
      ...emptyReadingGraphFilter,
      search: "Han Kang",
      format: "essay",
      thread: "women-body-interiority",
    });
    await user.click(screen.getByRole("button", { name: "Women / body" }));
    expect(onFilterChange).toHaveBeenLastCalledWith({
      ...emptyReadingGraphFilter,
      search: "Han Kang",
      format: "essay",
      thread: "",
    });
  });

  it("notifies the graph when source visibility changes", async () => {
    const user = userEvent.setup();
    const onShowSourceNodesChange = vi.fn();
    render(
      <ReadingsFilters
        threads={readingThreads}
        filter={emptyReadingGraphFilter}
        showSourceNodes
        onFilterChange={vi.fn()}
        onShowSourceNodesChange={onShowSourceNodesChange}
      />,
    );
    await user.click(screen.getByRole("checkbox", { name: "Show sources" }));
    expect(onShowSourceNodesChange).toHaveBeenCalledWith(false);
  });
});

function ControlledFilters({
  onFilterChange,
}: {
  onFilterChange: (filter: ReadingGraphFilter) => void;
}) {
  const [filter, setFilter] = useState(emptyReadingGraphFilter);
  return (
    <ReadingsFilters
      threads={readingThreads}
      filter={filter}
      showSourceNodes
      onFilterChange={(nextFilter) => {
        onFilterChange(nextFilter);
        setFilter(nextFilter);
      }}
      onShowSourceNodesChange={vi.fn()}
    />
  );
}
