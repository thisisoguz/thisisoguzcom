import { describe, expect, it } from "vitest";
import {
  readingEdges,
  readingSources,
  readingThreads,
  readings,
  type ReadingEdge,
  type ReadingSource,
} from "@/content/readings";
import {
  buildReadingGraphNodes,
  buildVisibleReadingEdges,
  filterReadings,
  getReadingGraphNodeRadius,
  placeSelectedReadingLabel,
  placeReadingGraphLabels,
  READING_GRAPH_CENTER,
  READING_GRAPH_HEIGHT,
  READING_GRAPH_ORBIT,
  READING_GRAPH_WIDTH,
  getVisibleReadingSources,
} from "@/lib/readings/graph";

describe("readings graph data helpers", () => {
  const nodes = buildReadingGraphNodes(readings, readingSources, readingEdges);

  it("contains exactly 34 unique Goodreads readings, all marked read", () => {
    expect(readings).toHaveLength(34);
    expect(new Set(readings.map(({ id }) => id)).size).toBe(34);
    expect(readings.every(({ status }) => status === "read")).toBe(true);
    expect(
      readings.every(({ title, localizedTitle, author, format }) =>
        Boolean(title && localizedTitle && author && format),
      ),
    ).toBe(true);
  });

  it("includes every title requested from the Goodreads screenshots", () => {
    const titles = new Set(readings.map(({ title }) => title));
    expect(
      [
        "Ward No. 6",
        "Better Than Optimism",
        "The Dark Daughter",
        "Frankenstein; or, The Modern Prometheus",
        "The Burnout Society",
        "Women Without Men",
        "The Vegetarian",
        "Missing Out: In Praise of the Unlived Life",
        "Being Human",
        "Deli İbram's Divan",
        "Yoldan Çıkanlar",
        "On the Firmness of the Wise",
        "Büyü",
        "Tante Rosa",
        "A Room of One's Own",
        "Disgrace",
        "Death with Interruptions",
        "The White Castle",
        "The Gardener and Death",
        "The Legend of Mount Ararat",
        "The Devil Within",
        "One Peach, A Thousand Peaches",
        "The Corrosion of Character",
        "Chronicle of a Death Foretold",
        "To Live",
        "The Great Passage",
        "The House of Paper",
        "The Hunchback",
        "Stolen Focus",
        "No Longer Human",
        "Raoul Taburin",
        "Woman at Point Zero",
        "The Woman in the Dunes",
        "A Season in Hakkari",
      ].filter((title) => !titles.has(title)),
    ).toEqual([]);
  });

  it("keeps source and thread nodes out of the reading count", () => {
    expect(nodes.filter(({ kind }) => kind === "reading")).toHaveLength(34);
    expect(nodes.filter(({ kind }) => kind === "source")).toHaveLength(2);
    expect(readingThreads).toHaveLength(5);
    expect(nodes).toHaveLength(readings.length + 2);
  });

  it("creates a main graph node for every reading", () => {
    expect(nodes.filter((node) => node.kind === "reading")).toHaveLength(
      readings.length,
    );
    for (const reading of readings)
      expect(nodes.find((node) => node.id === reading.id)?.kind).toBe(
        "reading",
      );
  });

  it("assigns collision-safe positions to fixed reading and source bubbles", () => {
    expect(getReadingGraphNodeRadius("reading")).toBeGreaterThan(
      getReadingGraphNodeRadius("source"),
    );
    for (let leftIndex = 0; leftIndex < nodes.length; leftIndex += 1) {
      for (
        let rightIndex = leftIndex + 1;
        rightIndex < nodes.length;
        rightIndex += 1
      ) {
        const left = nodes[leftIndex];
        const right = nodes[rightIndex];
        const distance = Math.hypot(left.x - right.x, left.y - right.y);
        const minimumDistance =
          getReadingGraphNodeRadius(left.kind) +
          getReadingGraphNodeRadius(right.kind) +
          12;
        expect(distance, `${left.id} and ${right.id}`).toBeGreaterThanOrEqual(
          minimumDistance,
        );
      }
    }
  });

  it("keeps all readings on a broad elliptical orbit with an open center", () => {
    const readingNodes = nodes.filter((node) => node.kind === "reading");
    const center = READING_GRAPH_CENTER;
    const orbit = READING_GRAPH_ORBIT;

    for (const node of readingNodes) {
      const normalizedRadius = Math.hypot(
        (node.x - center.x) / orbit.x,
        (node.y - center.y) / orbit.y,
      );
      expect(normalizedRadius, node.id).toBeGreaterThan(0.82);
      expect(normalizedRadius, node.id).toBeLessThan(1.18);
    }

    expect(readingNodes.filter((node) => node.x < center.x)).toHaveLength(17);
    expect(readingNodes.filter((node) => node.x >= center.x)).toHaveLength(17);
    expect(readingNodes.some((node) => node.y < center.y)).toBe(true);
    expect(readingNodes.some((node) => node.y > center.y)).toBe(true);
  });

  it("anchors book-club sources in opposite upper zones and keeps their readings nearby", () => {
    const byId = new Map(nodes.map((node) => [node.id, node]));
    const literaryLab = byId.get("literary-lab-book-club")!;
    const artemis = byId.get("artemis-book-club")!;
    expect(literaryLab.x).toBeLessThan(1400 * 0.2);
    expect(artemis.x).toBeGreaterThan(1400 * 0.8);
    expect(literaryLab.y).toBeLessThan(1100 * 0.15);
    expect(artemis.y).toBeLessThan(1100 * 0.15);

    const linkedReadings = readings.filter(
      (reading) =>
        reading.primarySourceId === "literary-lab-book-club" ||
        reading.sourceIds?.includes("literary-lab-book-club"),
    );
    expect(linkedReadings.map(({ id }) => id)).toEqual([
      "the-vegetarian",
      "a-room-of-ones-own",
      "women-without-men",
      "buyu",
      "tante-rosa",
      "woman-at-point-zero",
    ]);
    for (const reading of linkedReadings) {
      const node = byId.get(reading.id)!;
      expect(node.x).toBeLessThan(READING_GRAPH_CENTER.x);
      expect(
        Math.hypot(node.x - literaryLab.x, node.y - literaryLab.y),
      ).toBeLessThan(500);
    }

    const artemisReadings = readings.filter(
      (reading) =>
        reading.primarySourceId === "artemis-book-club" ||
        reading.sourceIds?.includes("artemis-book-club"),
    );
    expect(artemisReadings).toHaveLength(5);
    for (const reading of artemisReadings) {
      const node = byId.get(reading.id)!;
      expect(node.x).toBeGreaterThan(READING_GRAPH_CENTER.x);
      expect(Math.hypot(node.x - artemis.x, node.y - artemis.y)).toBeLessThan(
        500,
      );
    }
    for (const edge of readingEdges.filter(
      (item) => item.relation === "source-to-reading",
    )) {
      const source = byId.get(edge.source)!;
      const reading = byId.get(edge.target)!;
      expect(
        Math.hypot(source.x - reading.x, source.y - reading.y),
        edge.target,
      ).toBeLessThan(500);
    }
  });

  it("anchors selected labels directly beside nodes with bounded vertical correction", () => {
    const left = placeSelectedReadingLabel({ x: 360, y: 650 });
    expect(left.side).toBe("left");
    expect(left.x + left.width).toBe(360 - 48);
    expect(left.y).toBe(650 - left.height / 2);

    const right = placeSelectedReadingLabel({ x: 1040, y: 650 });
    expect(right.side).toBe("right");
    expect(right.x).toBe(1040 + 48);
    expect(right.y).toBe(650 - right.height / 2);

    const top = placeSelectedReadingLabel({ x: 360, y: 20 });
    expect(top.y).toBe(16);

    const bottom = placeSelectedReadingLabel({ x: 1040, y: 1290 });
    expect(bottom.y + bottom.height).toBe(READING_GRAPH_HEIGHT - 16);
  });

  it("places every node label inside the graph safe area", () => {
    const labels = placeReadingGraphLabels(
      nodes,
      new Set(nodes.map(({ id }) => id)),
    );
    expect(labels).toHaveLength(nodes.length);
    const boxes: { id: string; left: number; right: number; top: number; bottom: number }[] = [];

    for (const [id, label] of Array.from(labels.entries())) {
      const left =
        label.anchor === "end"
          ? label.x - label.width
          : label.anchor === "middle"
            ? label.x - label.width / 2
            : label.x;
      const right = left + label.width;
      expect(left, `${id} left bound`).toBeGreaterThanOrEqual(56);
      expect(right, `${id} right bound`).toBeLessThanOrEqual(
        READING_GRAPH_WIDTH - 56,
      );
      expect(label.y - label.height / 2, `${id} top bound`).toBeGreaterThanOrEqual(
        72,
      );
      expect(label.y + label.height / 2, `${id} bottom bound`).toBeLessThanOrEqual(
        READING_GRAPH_HEIGHT - 56,
      );
      boxes.push({
        id,
        left,
        right,
        top: label.y - label.height / 2,
        bottom: label.y + label.height / 2,
      });
    }

    for (let leftIndex = 0; leftIndex < boxes.length; leftIndex += 1) {
      for (
        let rightIndex = leftIndex + 1;
        rightIndex < boxes.length;
        rightIndex += 1
      ) {
        const left = boxes[leftIndex];
        const right = boxes[rightIndex];
        const overlapWidth = Math.max(
          0,
          Math.min(left.right, right.right) - Math.max(left.left, right.left),
        );
        const overlapHeight = Math.max(
          0,
          Math.min(left.bottom, right.bottom) - Math.max(left.top, right.top),
        );
        const overlapRatio =
          (overlapWidth * overlapHeight) /
          Math.min(
            (left.right - left.left) * (left.bottom - left.top),
            (right.right - right.left) * (right.bottom - right.top),
          );
        expect(
          overlapRatio,
          `${left.id} / ${right.id} major label overlap`,
        ).toBeLessThan(0.25);
      }
    }
  });

  it("places important reading labels without overlapping labels or node safety areas", () => {
    const importantNodes = nodes.filter(
      (node) => node.reading?.importance === 3,
    );
    const priorityIds = new Set([
      ...importantNodes.map(({ id }) => id),
      "literary-lab-book-club",
      "artemis-book-club",
    ]);
    const labels = placeReadingGraphLabels(nodes, priorityIds);
    expect(Array.from(priorityIds).filter((id) => !labels.has(id))).toEqual([]);
    const entries = Array.from(labels.entries());
    for (let leftIndex = 0; leftIndex < entries.length; leftIndex += 1) {
      const [leftId, left] = entries[leftIndex];
      const leftBox = {
        left:
          left.anchor === "end"
            ? left.x - left.width
            : left.anchor === "middle"
              ? left.x - left.width / 2
              : left.x,
        right:
          left.anchor === "end"
            ? left.x
            : left.anchor === "middle"
              ? left.x + left.width / 2
              : left.x + left.width,
        top: left.y - left.height / 2,
        bottom: left.y + left.height / 2,
      };
      for (
        let rightIndex = leftIndex + 1;
        rightIndex < entries.length;
        rightIndex += 1
      ) {
        const [, right] = entries[rightIndex];
        const rightBox = {
          left:
            right.anchor === "end"
              ? right.x - right.width
              : right.anchor === "middle"
                ? right.x - right.width / 2
                : right.x,
          right:
            right.anchor === "end"
              ? right.x
              : right.anchor === "middle"
                ? right.x + right.width / 2
                : right.x + right.width,
          top: right.y - right.height / 2,
          bottom: right.y + right.height / 2,
        };
        expect(
          leftBox.left < rightBox.right &&
            leftBox.right > rightBox.left &&
            leftBox.top < rightBox.bottom &&
            leftBox.bottom > rightBox.top,
          `${leftId} label overlap`,
        ).toBe(false);
      }
      for (const node of nodes) {
        if (node.id === leftId) continue;
        const closestX = Math.max(
          leftBox.left,
          Math.min(node.x, leftBox.right),
        );
        const closestY = Math.max(
          leftBox.top,
          Math.min(node.y, leftBox.bottom),
        );
        const safetyRadius = node.kind === "reading" ? 34 : 27;
        expect(
          Math.hypot(node.x - closestX, node.y - closestY),
          `${leftId} label / ${node.id}`,
        ).toBeGreaterThanOrEqual(safetyRadius);
      }
    }
  });

  it("makes a source visible when showAsNode is true", () => {
    const source: ReadingSource = {
      id: "always-visible",
      title: "Always Visible",
      sourceType: "person",
      showAsNode: true,
    };
    expect(getVisibleReadingSources([source], [], [])).toContain(source);
  });

  it("makes a source visible when it connects to at least two readings", () => {
    const source: ReadingSource = {
      id: "repeated-source",
      title: "Repeated Source",
      sourceType: "place",
    };
    const edges: ReadingEdge[] = [
      {
        source: source.id,
        target: "the-vegetarian",
        relation: "source-to-reading",
      },
      { source: source.id, target: "disgrace", relation: "source-to-reading" },
    ];
    expect(getVisibleReadingSources([source], readings, edges)).toEqual([
      source,
    ]);
  });

  it("keeps a one-off source out unless it is explicitly shown", () => {
    const source: ReadingSource = {
      id: "one-off",
      title: "One-off",
      sourceType: "friend",
    };
    const edges: ReadingEdge[] = [
      {
        source: source.id,
        target: "the-vegetarian",
        relation: "source-to-reading",
      },
    ];
    expect(getVisibleReadingSources([source], readings, edges)).toEqual([]);
  });

  it("does not turn themes into graph nodes", () => {
    expect(
      nodes.some(
        (node) => node.id === "attention" || node.label === "attention",
      ),
    ).toBe(false);
    expect(
      nodes.every((node) => node.kind === "reading" || node.kind === "source"),
    ).toBe(true);
  });

  it("does not turn authors into graph nodes", () => {
    expect(
      nodes.some((node) => node.label === "Han Kang" || node.id === "Han Kang"),
    ).toBe(false);
    expect(nodes.map((node) => String(node.kind))).not.toContain("author");
  });

  it("uses the English title as the visible graph label", () => {
    const vegetarianNode = nodes.find((node) => node.id === "the-vegetarian");
    expect(vegetarianNode?.label).toBe("The Vegetarian");
  });

  it("preserves localized titles without promoting them to graph labels", () => {
    const vegetarian = readings.find(
      (reading) => reading.id === "the-vegetarian",
    );
    const vegetarianNode = nodes.find((node) => node.id === "the-vegetarian");
    expect(vegetarian?.localizedTitle).toBe("Vejetaryen");
    expect(vegetarianNode?.label).not.toBe(vegetarian?.localizedTitle);
  });

  it("exposes only the approved source display names", () => {
    const visibleSourceLabels = nodes
      .filter((node) => node.kind === "source")
      .map((node) => node.label);
    expect(visibleSourceLabels).toContain("Literary Lab Book Club");
    expect(visibleSourceLabels).toContain("Artemis Book Club");
    expect(visibleSourceLabels).not.toContain("litlab");
    expect(visibleSourceLabels).not.toContain("artemis-kitap-kulübü");
  });

  it("filters by theme, thread, and source", () => {
    expect(
      filterReadings(readings, {
        search: "",
        format: "",
        status: "",
        thread: "",
        theme: "attention",
        source: "",
      }).map(({ id }) => id),
    ).toEqual(["the-burnout-society", "stolen-focus"]);
    expect(
      filterReadings(readings, {
        search: "",
        format: "",
        status: "",
        thread: "death-mortality-wisdom",
        theme: "",
        source: "",
      }).map(({ id }) => id),
    ).toEqual([
      "death-with-interruptions",
      "the-gardener-and-death",
      "on-the-firmness-of-the-wise",
      "chronicle-of-a-death-foretold",
      "to-live",
    ]);
    expect(
      filterReadings(readings, {
        search: "",
        format: "",
        status: "",
        thread: "",
        theme: "",
        source: "literary-lab-book-club",
      }).map(({ id }) => id),
    ).toEqual([
      "the-vegetarian",
      "a-room-of-ones-own",
      "women-without-men",
      "buyu",
      "tante-rosa",
      "woman-at-point-zero",
    ]);
    expect(
      filterReadings(
        readings,
        {
          search: "",
          format: "",
          status: "",
          thread: "",
          theme: "",
          source: "self-directed",
        },
        readingSources,
        readingThreads,
      ),
    ).toHaveLength(8);
  });

  it("filters by title and author text without changing the source data", () => {
    expect(
      filterReadings(readings, {
        search: "johann hari",
        format: "",
        status: "",
        thread: "",
        theme: "",
        source: "",
      }).map(({ id }) => id),
    ).toEqual(["stolen-focus"]);
    expect(
      filterReadings(
        readings,
        {
          search: "literary lab book club",
          format: "",
          status: "",
          thread: "",
          theme: "",
          source: "",
        },
        readingSources,
        readingThreads,
      ).map(({ id }) => id),
    ).toEqual([
      "the-vegetarian",
      "a-room-of-ones-own",
      "women-without-men",
      "buyu",
      "tante-rosa",
      "woman-at-point-zero",
    ]);
    expect(
      filterReadings(
        readings,
        {
          search: "mortality",
          format: "",
          status: "",
          thread: "",
          theme: "",
          source: "",
        },
        readingSources,
        readingThreads,
      ).map(({ id }) => id),
    ).toEqual([
      "death-with-interruptions",
      "the-gardener-and-death",
      "on-the-firmness-of-the-wise",
      "chronicle-of-a-death-foretold",
      "to-live",
    ]);
    expect(
      filterReadings(
        readings,
        {
          search: "death / mortality / wisdom",
          format: "",
          status: "",
          thread: "",
          theme: "",
          source: "",
        },
        readingSources,
        readingThreads,
      ).map(({ id }) => id),
    ).toEqual([
      "death-with-interruptions",
      "the-gardener-and-death",
      "on-the-firmness-of-the-wise",
      "chronicle-of-a-death-foretold",
      "to-live",
    ]);
    expect(readings).toHaveLength(34);
  });

  it("builds only edges whose endpoints remain visible", () => {
    const filteredEdges = buildVisibleReadingEdges(
      readingEdges,
      new Set(["the-vegetarian", "literary-lab-book-club"]),
    );
    expect(filteredEdges).toHaveLength(1);
    expect(filteredEdges[0].target).toBe("the-vegetarian");
  });

  it("deduplicates repeated and reversed reading relationships", () => {
    const duplicateEdges: ReadingEdge[] = [
      {
        source: "the-vegetarian",
        target: "disgrace",
        relation: "similar-theme",
        label: "body / identity",
      },
      {
        source: "the-vegetarian",
        target: "disgrace",
        relation: "similar-theme",
        label: "body / identity",
      },
      {
        source: "disgrace",
        target: "the-vegetarian",
        relation: "similar-theme",
        label: "body / identity",
      },
      {
        source: "the-vegetarian",
        target: "disgrace",
        relation: "bridge",
        label: "a different relationship",
      },
    ];

    expect(
      buildVisibleReadingEdges(
        duplicateEdges,
        new Set(["the-vegetarian", "disgrace"]),
      ),
    ).toHaveLength(2);
  });
});
