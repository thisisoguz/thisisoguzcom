import type {
  ReadingEdge,
  ReadingItem,
  ReadingSource,
} from "@/content/readings";

export const READING_GRAPH_WIDTH = 1400;
export const READING_GRAPH_HEIGHT = 1300;
export const READING_GRAPH_CENTER = { x: 700, y: 700 } as const;
export const READING_GRAPH_ORBIT = { x: 400, y: 430 } as const;

export type ReadingGraphNode = {
  id: string;
  kind: "reading" | "source";
  label: string;
  author?: string;
  reading?: ReadingItem;
  source?: ReadingSource;
  x: number;
  y: number;
};

export type ReadingGraphLabel = {
  x: number;
  y: number;
  anchor: "start" | "end" | "middle";
  width: number;
  height: number;
};

export type SelectedReadingLabelPlacement = {
  x: number;
  y: number;
  width: number;
  height: number;
  side: "left" | "right";
};

export function getReadingGraphNodeRadius(
  kind: ReadingGraphNode["kind"],
  options: { important?: boolean; selected?: boolean } = {},
): number {
  if (kind === "source") return options.selected ? 18 : 14;
  if (options.selected) return 32;
  return options.important ? 28 : 22;
}

export function placeSelectedReadingLabel(
  point: { x: number; y: number },
  graphWidth = READING_GRAPH_WIDTH,
  graphHeight = READING_GRAPH_HEIGHT,
): SelectedReadingLabelPlacement {
  const side = point.x < graphWidth / 2 ? "left" : "right";
  const horizontalOffset =
    getReadingGraphNodeRadius("reading", { selected: true }) + 16;
  const boundaryPadding = 12;
  const preferredWidth = 280;
  const availableWidth =
    side === "left"
      ? point.x - horizontalOffset - boundaryPadding
      : graphWidth - boundaryPadding - point.x - horizontalOffset;
  const width = Math.max(72, Math.min(preferredWidth, availableWidth));
  const height = 92;
  const x =
    side === "left"
      ? point.x - horizontalOffset - width
      : point.x + horizontalOffset;
  const y = Math.max(
    16,
    Math.min(point.y - height / 2, graphHeight - 16 - height),
  );

  return { x, y, width, height, side };
}

export type ReadingGraphFilter = {
  search: string;
  format: string;
  status: string;
  thread: string;
  theme: string;
  source: string;
};

export const emptyReadingGraphFilter: ReadingGraphFilter = {
  search: "",
  format: "",
  status: "",
  thread: "",
  theme: "",
  source: "",
};

export function getVisibleReadingSources(
  sources: ReadingSource[],
  readings: ReadingItem[],
  edges: ReadingEdge[],
): ReadingSource[] {
  const readingIds = new Set(readings.map(({ id }) => id));
  const connectedReadingCounts = new Map<string, Set<string>>();
  for (const edge of edges) {
    if (!readingIds.has(edge.target)) continue;
    const connected =
      connectedReadingCounts.get(edge.source) ?? new Set<string>();
    connected.add(edge.target);
    connectedReadingCounts.set(edge.source, connected);
  }
  return sources.filter(
    (source) =>
      source.showAsNode === true ||
      (connectedReadingCounts.get(source.id)?.size ?? 0) >= 2,
  );
}

export function buildReadingGraphNodes(
  readings: ReadingItem[],
  sources: ReadingSource[],
  edges: ReadingEdge[],
): ReadingGraphNode[] {
  const visibleSources = getVisibleReadingSources(sources, readings, edges);
  const nodes: ReadingGraphNode[] = [
    ...readings.map((reading) => ({
      id: reading.id,
      kind: "reading" as const,
      label: reading.title,
      author: reading.author,
      reading,
      x: 0,
      y: 0,
    })),
    ...visibleSources.map((source) => ({
      id: source.id,
      kind: "source" as const,
      label: source.title,
      source,
      x: 0,
      y: 0,
    })),
  ];
  const positions = settleReadingGraph(nodes);
  return nodes.map((node) => ({ ...node, ...positions.get(node.id) }));
}

export function placeReadingGraphLabels(
  nodes: ReadingGraphNode[],
  priorityIds: Set<string>,
  width = READING_GRAPH_WIDTH,
  height = READING_GRAPH_HEIGHT,
): Map<string, ReadingGraphLabel> {
  type Box = { left: number; right: number; top: number; bottom: number };
  type Candidate = ReadingGraphLabel & { box: Box; score: number };
  const placed: Box[] = [];
  const labels = new Map<string, ReadingGraphLabel>();
  const ordered = nodes
    .filter((node) => priorityIds.has(node.id))
    .slice()
    .sort((a, b) => {
      const priority = (node: ReadingGraphNode) =>
        node.kind === "source"
          ? 2
          : node.reading?.importance === 3
            ? 4
            : getReadingSourceAnchorId(node.reading!)
              ? 3
              : 1;
      return priority(b) - priority(a);
    });
  const nodeBoxes = nodes.map((node) => ({
    node,
    radius: node.kind === "reading" ? 26 : 19,
  }));

  const overlapArea = (left: Box, right: Box) =>
    Math.max(0, Math.min(left.right, right.right) - Math.max(left.left, right.left)) *
    Math.max(0, Math.min(left.bottom, right.bottom) - Math.max(left.top, right.top));

  for (const node of ordered) {
    const widthForLabel =
      node.kind === "reading"
        ? Math.min(
            360,
            Math.max(210, node.label.length * 14, (node.author?.length ?? 0) * 11),
          )
        : Math.min(250, Math.max(170, node.label.length * 11));
    const heightForLabel = node.kind === "reading" ? 104 : 54;
    const gap = node.kind === "reading" ? 14 : 12;
    const radius = getReadingGraphNodeRadius(node.kind);
    const horizontalDirection = node.x < width / 2 ? -1 : 1;
    const horizontalAnchor = horizontalDirection < 0 ? "end" : "start";
    const verticalFallbackDirection = node.y < height / 2 ? 1 : -1;
    const rawCandidates: Omit<Candidate, "box" | "score">[] = [];
    const verticalStep = heightForLabel + 14;
    const horizontalStep = widthForLabel + 18;
    const verticalOffsets = [
      0,
      -verticalStep,
      verticalStep,
      -verticalStep * 2,
      verticalStep * 2,
      -verticalStep * 3,
      verticalStep * 3,
      -verticalStep * 4,
      verticalStep * 4,
    ];
    const horizontalOffsets = [
      0,
      -horizontalStep,
      horizontalStep,
      -horizontalStep * 2,
      horizontalStep * 2,
    ];

    for (const radialOffset of [0, horizontalStep, horizontalStep * 2]) {
      for (const tangentOffset of verticalOffsets) {
        rawCandidates.push({
          x:
            node.x +
            horizontalDirection * (radius + gap + radialOffset),
          y: node.y + tangentOffset,
          anchor: horizontalAnchor,
          width: widthForLabel,
          height: heightForLabel,
        });
      }
    }
    const laneAnchor = horizontalDirection < 0 ? "end" : "start";
    const laneXs =
      horizontalDirection < 0
        ? [56 + widthForLabel, width / 2 + 80]
        : [width - 56 - widthForLabel, width / 2 - 80];
    const minimumLaneY = 72 + heightForLabel / 2;
    const maximumLaneY = height - 56 - heightForLabel / 2;
    const laneYs = Array.from(
      { length: Math.floor((maximumLaneY - minimumLaneY) / 18) + 1 },
      (_, index) => minimumLaneY + index * 18,
    ).sort((left, right) =>
      Math.abs(left - node.y) - Math.abs(right - node.y),
    );
    for (const x of laneXs) {
      for (const y of laneYs) {
        rawCandidates.push({
          x,
          y,
          anchor: laneAnchor,
          width: widthForLabel,
          height: heightForLabel,
        });
      }
    }
    const minimumRowX = 56 + widthForLabel / 2;
    const maximumRowX = width - 56 - widthForLabel / 2;
    const rowXs = Array.from(
      { length: Math.floor((maximumRowX - minimumRowX) / 18) + 1 },
      (_, index) => minimumRowX + index * 18,
    ).sort((left, right) =>
      Math.abs(left - node.x) - Math.abs(right - node.x),
    );
    for (const y of [minimumLaneY, maximumLaneY]) {
      for (const x of rowXs) {
        rawCandidates.push({
          x,
          y,
          anchor: "middle",
          width: widthForLabel,
          height: heightForLabel,
        });
      }
    }
    for (const radialOffset of [0, verticalStep, verticalStep * 2]) {
      for (const tangentOffset of horizontalOffsets) {
        rawCandidates.push({
          x: node.x + tangentOffset,
          y:
            node.y +
            verticalFallbackDirection *
              (radius + gap + heightForLabel / 2 + radialOffset),
          anchor: "middle",
          width: widthForLabel,
          height: heightForLabel,
        });
      }
    }
    for (const radialOffset of [0, horizontalStep, horizontalStep * 2]) {
      for (const tangentOffset of verticalOffsets) {
        rawCandidates.push({
          x:
            node.x -
            horizontalDirection * (radius + gap + radialOffset),
          y: node.y + tangentOffset,
          anchor: horizontalDirection < 0 ? "start" : "end",
          width: widthForLabel,
          height: heightForLabel,
        });
      }
    }

    let bestCandidate: Candidate | undefined;
    for (const candidate of rawCandidates) {
      const left =
        candidate.anchor === "end"
          ? candidate.x - widthForLabel
          : candidate.anchor === "middle"
            ? candidate.x - widthForLabel / 2
            : candidate.x;
      const box = {
        left,
        right: left + widthForLabel,
        top: candidate.y - heightForLabel / 2,
        bottom: candidate.y + heightForLabel / 2,
      };
      if (
        box.left < 56 ||
        box.right > width - 56 ||
        box.top < 72 ||
        box.bottom > height - 56
      )
        continue;
      const labelOverlap = placed.reduce(
        (total, existing) => total + overlapArea(box, existing),
        0,
      );
      const nodeOverlap = nodeBoxes.reduce((total, item) => {
        if (item.node.id === node.id) return total;
        const closestX = Math.max(box.left, Math.min(item.node.x, box.right));
        const closestY = Math.max(box.top, Math.min(item.node.y, box.bottom));
        const overlap = item.radius + 8 - Math.hypot(
          item.node.x - closestX,
          item.node.y - closestY,
        );
        return total + Math.max(0, overlap) ** 2;
      }, 0);
      const score = labelOverlap * 8 + nodeOverlap * 14;
      const scored = { ...candidate, box, score };
      if (!bestCandidate || scored.score < bestCandidate.score)
        bestCandidate = scored;
      if (score === 0) break;
    }

    if (!bestCandidate) continue;
    placed.push(bestCandidate.box);
    labels.set(node.id, {
      x: bestCandidate.x,
      y: bestCandidate.y,
      anchor: bestCandidate.anchor,
      width: bestCandidate.width,
      height: bestCandidate.height,
    });
  }
  return labels;
}

export function getReadingSourceAnchorId(
  reading: ReadingItem,
): string | undefined {
  const sourceIds = [
    ...(reading.primarySourceId ? [reading.primarySourceId] : []),
    ...(reading.sourceIds ?? []),
  ];
  return sourceIds.find(
    (sourceId) =>
      sourceId === "literary-lab-book-club" || sourceId === "artemis-book-club",
  );
}

export function buildVisibleReadingEdges(
  edges: ReadingEdge[],
  visibleNodeIds: Set<string>,
): ReadingEdge[] {
  const seen = new Set<string>();
  return edges.filter((edge) => {
    if (!visibleNodeIds.has(edge.source) || !visibleNodeIds.has(edge.target))
      return false;
    const endpoints =
      edge.relation === "source-to-reading"
        ? [edge.source, edge.target]
        : [edge.source, edge.target].sort();
    const key = `${endpoints[0]}:${endpoints[1]}:${edge.relation}:${edge.label ?? ""}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function filterReadings(
  readings: ReadingItem[],
  filter: ReadingGraphFilter,
  sources: ReadingSource[] = [],
  threads: { id: string; title: string }[] = [],
): ReadingItem[] {
  const query = filter.search.trim().toLocaleLowerCase();
  return readings.filter((reading) => {
    const relatedSourceIds = Array.from(
      new Set([
        ...(reading.sourceIds ?? []),
        ...(reading.primarySourceId ? [reading.primarySourceId] : []),
      ]),
    );
    const searchableDetails = [
      reading.title,
      reading.localizedTitle ?? "",
      reading.author,
      reading.discoveredVia ?? "",
      ...relatedSourceIds.flatMap((sourceId) => {
        const source = sources.find((item) => item.id === sourceId);
        return source ? [source.title] : [];
      }),
      ...reading.themes,
      ...(reading.threadIds ?? []).flatMap((threadId) => {
        const thread = threads.find((item) => item.id === threadId);
        return thread ? [thread.title] : [];
      }),
    ];
    const matchesSearch =
      !query || searchableDetails.join(" ").toLocaleLowerCase().includes(query);
    const matchesFormat = !filter.format || reading.format === filter.format;
    const matchesStatus = !filter.status || reading.status === filter.status;
    const matchesThread =
      !filter.thread || reading.threadIds?.includes(filter.thread) === true;
    const matchesTheme = !filter.theme || reading.themes.includes(filter.theme);
    const selectedSource = sources.find((source) => source.id === filter.source);
    const matchesSource =
      !filter.source ||
      relatedSourceIds.includes(filter.source) ||
      (selectedSource !== undefined &&
        reading.discoveredVia === selectedSource.title);
    return (
      matchesSearch &&
      matchesFormat &&
      matchesStatus &&
      matchesThread &&
      matchesTheme &&
      matchesSource
    );
  });
}

/** A deterministic elliptical orbit with source sectors, semantic arcs, and tightly bounded collision relaxation. */
function settleReadingGraph(
  nodes: ReadingGraphNode[],
): Map<string, { x: number; y: number }> {
  const center = READING_GRAPH_CENTER;
  const orbit = READING_GRAPH_ORBIT;
  const positions = new Map<string, { x: number; y: number }>();
  const slots = new Map<string, { x: number; y: number }>();
  const readingNodes = nodes.filter((node) => node.kind === "reading");
  const leftSourceId = "literary-lab-book-club";
  const rightSourceId = "artemis-book-club";
  const sourceNodes = nodes.filter((node) => node.kind === "source");
  const sourcePositions = new Map<string, { x: number; y: number }>([
    [leftSourceId, { x: 270, y: 160 }],
    [rightSourceId, { x: 1130, y: 160 }],
  ]);
  for (const source of sourceNodes) {
    positions.set(
      source.id,
      sourcePositions.get(source.id) ?? { x: center.x, y: 110 },
    );
  }

  const linkedTo = (node: ReadingGraphNode, sourceId: string) =>
    node.reading?.primarySourceId === sourceId ||
    node.reading?.sourceIds?.includes(sourceId) === true;
  const literaryLabReadings = readingNodes.filter((node) =>
    linkedTo(node, leftSourceId),
  );
  const artemisReadings = readingNodes.filter((node) =>
    linkedTo(node, rightSourceId),
  );
  const sourceLinkedIds = new Set<string>(
    [...literaryLabReadings, ...artemisReadings].map(({ id }) => id),
  );
  const independentReadings = readingNodes.filter(
    (node) => !sourceLinkedIds.has(node.id),
  );

  const anglesBetween = (start: number, end: number, count: number) => {
    if (count <= 1) return [(start + end) / 2];
    return Array.from(
      { length: count },
      (_, index) => start + ((end - start) * index) / (count - 1),
    );
  };
  const radialOffsets = [0, 20, -14, 27, -21, 11, -8];
  const assignArc = (
    arcNodes: ReadingGraphNode[],
    startAngle: number,
    endAngle: number,
  ) => {
    const angles = anglesBetween(startAngle, endAngle, arcNodes.length);
    arcNodes.forEach((node, index) => {
      const angle = (angles[index] * Math.PI) / 180;
      const radialOffset = radialOffsets[index % radialOffsets.length];
      slots.set(node.id, {
        x: center.x + (orbit.x + radialOffset) * Math.cos(angle),
        y: center.y + (orbit.y + radialOffset * 0.72) * Math.sin(angle),
      });
    });
  };

  assignArc(literaryLabReadings, -170, -110);
  assignArc(artemisReadings, -70, -8);

  const semanticArcs = [
    { threadId: "women-body-interiority", start: -100, end: -82 },
    { threadId: "fatigue-modernity-attention", start: 3, end: 45 },
    { threadId: "alienation-shame-fragmentation", start: 56, end: 105 },
    { threadId: "death-mortality-wisdom", start: 115, end: 138 },
    { threadId: "turkish-literature-memory", start: 148, end: 172 },
  ];
  const assignedIndependentIds = new Set<string>();
  for (const arc of semanticArcs) {
    const arcNodes = independentReadings.filter(
      (node) => node.reading?.threadIds?.[0] === arc.threadId,
    );
    arcNodes.forEach((node) => assignedIndependentIds.add(node.id));
    assignArc(arcNodes, arc.start, arc.end);
  }
  const unassigned = independentReadings.filter(
    (node) => !assignedIndependentIds.has(node.id),
  );
  assignArc(unassigned, 178, 188);

  const readingCollisionDistance = (node: ReadingGraphNode) =>
    Math.min(
      88,
      58 + Math.max(0, node.label.length - 12) * 0.65 +
        (node.reading?.importance === 3 ? 6 : 0),
    );
  const relaxed = new Map(
    readingNodes.map((node) => [node.id, { ...slots.get(node.id)! }]),
  );
  for (let iteration = 0; iteration < 36; iteration += 1) {
    for (let leftIndex = 0; leftIndex < readingNodes.length; leftIndex += 1) {
      for (
        let rightIndex = leftIndex + 1;
        rightIndex < readingNodes.length;
        rightIndex += 1
      ) {
        const left = readingNodes[leftIndex];
        const right = readingNodes[rightIndex];
        const leftPoint = relaxed.get(left.id)!;
        const rightPoint = relaxed.get(right.id)!;
        let dx = rightPoint.x - leftPoint.x;
        let dy = rightPoint.y - leftPoint.y;
        let distance = Math.hypot(dx, dy);
        if (distance === 0) {
          dx = 1;
          dy = 0;
          distance = 1;
        }
        const minimumDistance = Math.max(
          readingCollisionDistance(left),
          readingCollisionDistance(right),
        );
        if (distance >= minimumDistance) continue;
        const push = ((minimumDistance - distance) * 0.48) / distance;
        leftPoint.x -= dx * push;
        leftPoint.y -= dy * push;
        rightPoint.x += dx * push;
        rightPoint.y += dy * push;
      }
    }
    for (const node of readingNodes) {
      const point = relaxed.get(node.id)!;
      const slot = slots.get(node.id)!;
      let dx = point.x - slot.x;
      let dy = point.y - slot.y;
      const displacement = Math.hypot(dx, dy);
      if (displacement > 34) {
        dx = (dx / displacement) * 34;
        dy = (dy / displacement) * 34;
      }
      point.x = slot.x + dx * 0.94;
      point.y = slot.y + dy * 0.94;
    }
  }
  relaxed.forEach((point, id) => positions.set(id, point));

  positions.forEach((point, id) =>
    positions.set(id, {
      x: Math.round(point.x * 100) / 100,
      y: Math.round(point.y * 100) / 100,
    }),
  );
  return positions;
}
