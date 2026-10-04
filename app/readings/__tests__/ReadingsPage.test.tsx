import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import ReadingsPage from "@/app/readings/page";

describe("ReadingsPage V2", () => {
  it("renders the title and requested introduction", () => {
    render(<ReadingsPage />);
    expect(
      screen.getByRole("heading", { level: 1, name: "Readings" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "A personal map of readings, sources, and the paths that led from one idea to another.",
      ),
    ).toBeInTheDocument();
  });

  it("shows 34 readings in the graph count, excluding sources and threads", () => {
    render(<ReadingsPage />);
    expect(screen.getByText("Reading map · 34 readings")).toBeInTheDocument();
    expect(screen.getByText("Showing 34 of 34 readings")).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /^Reading:/ })).toHaveLength(
      34,
    );
    expect(screen.getAllByRole("button", { name: /^Source:/ })).toHaveLength(2);
    expect(
      screen.getByRole("group", { name: "Threads" }).querySelectorAll("button"),
    ).toHaveLength(5);
  });

  it("explains all three graph node and edge types in the legend", () => {
    render(<ReadingsPage />);
    const legend = screen.getByRole("list", { name: "Graph legend" });
    expect(legend).toHaveTextContent("Green circles = readings");
    expect(legend).toHaveTextContent("Small beige circles = sources");
    expect(legend).toHaveTextContent("Thin lines = relationships");
  });

  it("renders both recurring book club sources", () => {
    render(<ReadingsPage />);
    expect(
      screen.getByRole("button", { name: "Source: Literary Lab Book Club" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Source: Artemis Book Club" }),
    ).toBeInTheDocument();
  });

  it("keeps reading labels hidden by default while source labels remain visible", () => {
    const { container } = render(<ReadingsPage />);
    expect(
      screen.getByRole("button", {
        name: "Reading: The Vegetarian by Han Kang",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: "Reading: The Burnout Society by Byung-Chul Han",
      }),
    ).toBeInTheDocument();
    const readingNode = screen.getByRole("button", {
      name: "Reading: The Vegetarian by Han Kang",
    });
    expect(readingNode.querySelector("circle")).toBeInTheDocument();
    expect(readingNode.querySelector("rect")).not.toBeInTheDocument();
    expect(readingNode.querySelector("foreignObject")).not.toBeInTheDocument();
    expect(readingNode.querySelectorAll("text")).toHaveLength(0);
    expect(container.querySelectorAll("g[class*='readingLabel']")).toHaveLength(
      0,
    );
    expect(container.querySelectorAll("g[class*='edgeLabel']")).toHaveLength(0);
    const sourceNode = screen.getByRole("button", {
      name: "Source: Literary Lab Book Club",
    });
    expect(sourceNode.querySelector("circle")).toBeInTheDocument();
    expect(sourceNode.querySelector("rect")).not.toBeInTheDocument();
    expect(
      Array.from(sourceNode.querySelectorAll("text tspan")).map(
        (line) => line.textContent,
      ),
    ).toEqual(["Literary Lab Book", "Club"]);
  });

  it("shows a reading title and author on hover without moving the node", async () => {
    const user = userEvent.setup();
    render(<ReadingsPage />);
    const readingNode = screen.getByRole("button", {
      name: "Reading: The Vegetarian by Han Kang",
    });
    const circle = readingNode.querySelector("circle");
    const originalPosition = {
      x: circle?.getAttribute("cx"),
      y: circle?.getAttribute("cy"),
    };

    await user.hover(readingNode);
    expect(
      readingNode.querySelector("g[class*='readingLabel']"),
    ).toHaveTextContent("The Vegetarian");
    expect(
      readingNode.querySelector("g[class*='readingLabel']"),
    ).toHaveTextContent("Han Kang");
    expect(circle).toHaveAttribute("cx", originalPosition.x);
    expect(circle).toHaveAttribute("cy", originalPosition.y);

    await user.unhover(readingNode);
    expect(
      readingNode.querySelector("g[class*='readingLabel']"),
    ).not.toBeInTheDocument();
  });

  it("opens a reading detail panel with localized metadata", async () => {
    const user = userEvent.setup();
    const { container } = render(<ReadingsPage />);
    await user.click(
      screen.getByRole("button", {
        name: "Reading: The Vegetarian by Han Kang",
      }),
    );
    const selectedNode = screen.getByRole("button", {
      name: "Reading: The Vegetarian by Han Kang",
    });
    await user.unhover(selectedNode);
    const selectedLabel = selectedNode.querySelector(
      "[data-selected-reading-label='the-vegetarian']",
    );
    expect(
      selectedLabel,
    ).toHaveTextContent("The Vegetarian");
    expect(selectedLabel).toHaveTextContent("Han Kang");
    expect(selectedLabel?.querySelectorAll("p")).toHaveLength(2);
    const selectedCircleX = Number(
      selectedNode.querySelector("circle")?.getAttribute("cx"),
    );
    const selectedLabelX = Number(selectedLabel?.getAttribute("x"));
    const selectedLabelWidth = Number(selectedLabel?.getAttribute("width"));
    expect(selectedLabelX + selectedLabelWidth).toBe(
      selectedCircleX - 48,
    );
    const panel = screen.getByLabelText("Reading details");
    expect(
      within(panel).getByRole("heading", { level: 2, name: "The Vegetarian" }),
    ).toBeInTheDocument();
    expect(within(panel).getByText("Vejetaryen")).toBeInTheDocument();
    expect(within(panel).getByText("Han Kang")).toBeInTheDocument();
    expect(
      within(panel).getByRole("button", { name: "Close details" }),
    ).toBeInTheDocument();
    expect(
      container.querySelectorAll("g[class*='edgeLabel']").length,
    ).toBeGreaterThan(0);
  });

  it("opens a source detail panel and lists its connected readings", async () => {
    const user = userEvent.setup();
    render(<ReadingsPage />);
    await user.click(
      screen.getByRole("button", { name: "Source: Literary Lab Book Club" }),
    );
    const panel = screen.getByLabelText("Reading details");
    expect(
      within(panel).getByRole("heading", {
        level: 2,
        name: "Literary Lab Book Club",
      }),
    ).toBeInTheDocument();
    expect(within(panel).getByText("Connected readings")).toBeInTheDocument();
    expect(within(panel).getByText("The Vegetarian")).toBeInTheDocument();
    expect(within(panel).getByText("A Room of One's Own")).toBeInTheDocument();
    expect(within(panel).getByText("Women Without Men")).toBeInTheDocument();
    expect(within(panel).getByText("Büyü")).toBeInTheDocument();
    expect(within(panel).getByText("Tante Rosa")).toBeInTheDocument();
    expect(within(panel).getByText("Woman at Point Zero")).toBeInTheDocument();
    expect(within(panel).getAllByRole("listitem")).toHaveLength(6);
  });

  it("closes the selected detail panel with Escape", async () => {
    const user = userEvent.setup();
    render(<ReadingsPage />);
    await user.click(
      screen.getByRole("button", {
        name: "Reading: Disgrace by J. M. Coetzee",
      }),
    );
    expect(
      screen.getByRole("heading", { level: 2, name: "Disgrace" }),
    ).toBeInTheDocument();
    await user.keyboard("{Escape}");
    expect(
      screen.getByRole("heading", { name: "Select a reading or source" }),
    ).toBeInTheDocument();
  });

  it("supports keyboard selection and clears a selection hidden by search", async () => {
    const user = userEvent.setup();
    render(<ReadingsPage />);
    const readingNode = screen.getByRole("button", {
      name: "Reading: The Vegetarian by Han Kang",
    });
    readingNode.focus();
    await user.keyboard("{Enter}");
    expect(
      screen.getByRole("heading", { level: 2, name: "The Vegetarian" }),
    ).toBeInTheDocument();

    await user.type(
      screen.getByRole("searchbox", { name: "Search readings" }),
      "not in this archive",
    );
    expect(
      screen.getByText("No readings match these filters."),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Select a reading or source" }),
    ).toBeInTheDocument();
  });

  it("restores the full graph and source nodes with Reset view", async () => {
    const user = userEvent.setup();
    render(<ReadingsPage />);
    await user.click(screen.getByRole("checkbox", { name: "Show sources" }));
    expect(
      screen.queryByRole("button", { name: "Source: Literary Lab Book Club" }),
    ).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Death / mortality" }));
    expect(screen.getByText("Showing 5 of 34 readings")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Reset view" }));
    expect(screen.getByText("Showing 34 of 34 readings")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Source: Literary Lab Book Club" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("checkbox", { name: "Show sources" }),
    ).toBeChecked();
  });
});
