"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type {
  PointerEvent as ReactPointerEvent,
  WheelEvent as ReactWheelEvent,
} from "react";
import {
  readingEdges,
  readingSources,
  readingThreads,
  readings,
} from "@/content/readings";
import {
  buildReadingGraphNodes,
  buildVisibleReadingEdges,
  emptyReadingGraphFilter,
  filterReadings,
  getReadingGraphNodeRadius,
  placeSelectedReadingLabel,
  placeReadingGraphLabels,
  READING_GRAPH_HEIGHT,
  READING_GRAPH_WIDTH,
  type ReadingGraphFilter,
} from "@/lib/readings/graph";
import { ReadingsFilters } from "./ReadingsFilters";
import { ReadingsLegend } from "./ReadingsLegend";
import { ReadingsPanel } from "./ReadingsPanel";
import styles from "./readings.module.css";

type GraphPoint = { x: number; y: number };
type GraphView = { x: number; y: number; scale: number };

function wrapLabel(value: string, maxLength = 22): string[] {
  const lines: string[] = [];
  let current = "";
  for (const word of value.split(/\s+/)) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxLength && current) {
      lines.push(current);
      current = word;
    } else current = next;
  }
  if (current) lines.push(current);
  if (lines.length <= 2) return lines;
  const remainder = lines.slice(1).join(" ");
  return [
    lines[0],
    remainder.length > maxLength
      ? `${remainder.slice(0, maxLength - 1).trimEnd()}…`
      : remainder,
  ];
}

function clampLabel(value: string, maxLength = 26): string {
  return value.length > maxLength
    ? `${value.slice(0, maxLength - 1).trimEnd()}…`
    : value;
}

type PointerGesture =
  | {
      type: "node";
      id: string;
      pointerId: number;
      startX: number;
      startY: number;
      origin: GraphPoint;
      moved: boolean;
    }
  | {
      type: "pan";
      pointerId: number;
      startClientX: number;
      startClientY: number;
      origin: GraphView;
    };

export function ReadingsGraph() {
  const [filter, setFilter] = useState<ReadingGraphFilter>(
    emptyReadingGraphFilter,
  );
  const [showSourceNodes, setShowSourceNodes] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draggedPositions, setDraggedPositions] = useState<
    Record<string, GraphPoint>
  >({});
  const [view, setView] = useState<GraphView>({ x: 0, y: 0, scale: 1 });
  const [hoveredEdge, setHoveredEdge] = useState<string | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [isNarrowGraph, setIsNarrowGraph] = useState(false);
  const gesture = useRef<PointerGesture | null>(null);
  const skipClick = useRef(false);
  const graphNodes = useMemo(
    () => buildReadingGraphNodes(readings, readingSources, readingEdges),
    [],
  );
  const filteredReadings = useMemo(
    () => filterReadings(readings, filter, readingSources, readingThreads),
    [filter],
  );
  const filteredReadingIds = useMemo(
    () => new Set(filteredReadings.map(({ id }) => id)),
    [filteredReadings],
  );
  const activeSourceIds = useMemo(
    () =>
      new Set(
        readingEdges
          .filter((edge) => filteredReadingIds.has(edge.target))
          .map((edge) => edge.source),
      ),
    [filteredReadingIds],
  );
  const visibleNodes = useMemo(
    () =>
      graphNodes.filter((node) =>
        node.kind === "reading"
          ? filteredReadingIds.has(node.id)
          : showSourceNodes &&
            activeSourceIds.has(node.id) &&
            (!filter.source || node.id === filter.source),
      ),
    [
      graphNodes,
      filteredReadingIds,
      showSourceNodes,
      activeSourceIds,
      filter.source,
    ],
  );
  const visibleNodeIds = useMemo(
    () => new Set(visibleNodes.map(({ id }) => id)),
    [visibleNodes],
  );
  const visibleEdges = useMemo(
    () => buildVisibleReadingEdges(readingEdges, visibleNodeIds),
    [visibleNodeIds],
  );
  const selectedNode = selectedId
    ? visibleNodes.find(({ id }) => id === selectedId)
    : undefined;
  const selectedDetail = selectedNode?.reading ?? selectedNode?.source ?? null;
  const positionedNodes = useMemo(
    () =>
      visibleNodes.map((node) => ({
        ...node,
        ...(draggedPositions[node.id] ?? {}),
      })),
    [visibleNodes, draggedPositions],
  );
  const coordinateWidth = isNarrowGraph ? 870 : READING_GRAPH_WIDTH;
  const renderedNodes = useMemo(() => {
    const horizontalScale = isNarrowGraph ? 0.62 : 1;
    return positionedNodes
      .map((node) => ({ ...node, x: node.x * horizontalScale }))
      .slice()
      .sort(
        (left, right) =>
          Number(left.reading?.importance === 3) -
          Number(right.reading?.importance === 3),
      );
  }, [positionedNodes, isNarrowGraph]);
  const relatedNodeIds = useMemo(() => {
    const related = new Set<string>();
    if (!selectedId) return related;
    for (const edge of visibleEdges) {
      if (edge.source === selectedId) related.add(edge.target);
      if (edge.target === selectedId) related.add(edge.source);
    }
    return related;
  }, [selectedId, visibleEdges]);
  const priorityLabelIds = useMemo(() => {
    const priority = new Set<string>();
    for (const node of renderedNodes) {
      if (node.kind === "source") priority.add(node.id);
    }
    if (hoveredNodeId && hoveredNodeId !== selectedId)
      priority.add(hoveredNodeId);
    return priority;
  }, [renderedNodes, selectedId, hoveredNodeId]);
  const labelPositions = useMemo(
    () =>
      placeReadingGraphLabels(
        renderedNodes,
        priorityLabelIds,
        coordinateWidth,
        READING_GRAPH_HEIGHT,
      ),
    [renderedNodes, priorityLabelIds, coordinateWidth],
  );
  const pointFromClient = (
    svg: SVGSVGElement,
    clientX: number,
    clientY: number,
  ) => {
    const bounds = svg.getBoundingClientRect();
    const localX = ((clientX - bounds.left) / bounds.width) * coordinateWidth;
    const localY =
      ((clientY - bounds.top) / bounds.height) * READING_GRAPH_HEIGHT;
    return {
      x: (localX - view.x) / view.scale,
      y: (localY - view.y) / view.scale,
    };
  };

  const startNodeDrag = (event: ReactPointerEvent<SVGGElement>, id: string) => {
    event.stopPropagation();
    const svg = event.currentTarget.ownerSVGElement;
    if (!svg) return;
    const node = renderedNodes.find((item) => item.id === id);
    if (!node) return;
    const point = pointFromClient(svg, event.clientX, event.clientY);
    gesture.current = {
      type: "node",
      id,
      pointerId: event.pointerId,
      startX: point.x,
      startY: point.y,
      origin: { x: node.x, y: node.y },
      moved: false,
    };
    skipClick.current = false;
  };

  const startPan = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (event.target !== event.currentTarget) return;
    gesture.current = {
      type: "pan",
      pointerId: event.pointerId,
      startClientX: event.clientX,
      startClientY: event.clientY,
      origin: view,
    };
  };

  const moveGraphPointer = (event: ReactPointerEvent<SVGSVGElement>) => {
    const active = gesture.current;
    if (!active || active.pointerId !== event.pointerId) return;
    if (active.type === "node") {
      const point = pointFromClient(
        event.currentTarget,
        event.clientX,
        event.clientY,
      );
      if (Math.hypot(point.x - active.startX, point.y - active.startY) > 2) {
        active.moved = true;
        skipClick.current = true;
      }
      setDraggedPositions((previous) => ({
        ...previous,
        [active.id]: {
          x:
            (active.origin.x + point.x - active.startX) /
            (isNarrowGraph ? 0.62 : 1),
          y: active.origin.y + point.y - active.startY,
        },
      }));
    } else {
      const bounds = event.currentTarget.getBoundingClientRect();
      setView({
        ...active.origin,
        x:
          active.origin.x +
          ((event.clientX - active.startClientX) / bounds.width) *
            coordinateWidth,
        y:
          active.origin.y +
          ((event.clientY - active.startClientY) / bounds.height) *
            READING_GRAPH_HEIGHT,
      });
    }
  };

  const endGraphPointer = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (gesture.current?.pointerId !== event.pointerId) return;
    gesture.current = null;
  };

  const zoomGraph = (event: ReactWheelEvent<SVGSVGElement>) => {
    event.preventDefault();
    setView((previous) => ({
      ...previous,
      scale: Math.max(
        0.72,
        Math.min(1.75, previous.scale * (event.deltaY < 0 ? 1.08 : 0.92)),
      ),
    }));
  };

  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    const media = window.matchMedia("(max-width: 600px)");
    const updateNarrowGraph = () => setIsNarrowGraph(media.matches);
    updateNarrowGraph();
    media.addEventListener("change", updateNarrowGraph);
    return () => media.removeEventListener("change", updateNarrowGraph);
  }, []);

  useEffect(() => {
    if (selectedId && !visibleNodeIds.has(selectedId)) setSelectedId(null);
  }, [selectedId, visibleNodeIds]);

  useEffect(() => {
    if (!selectedId) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedId(null);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [selectedId]);

  const resetGraph = () => {
    setFilter(emptyReadingGraphFilter);
    setShowSourceNodes(true);
    setSelectedId(null);
    setDraggedPositions({});
    setView({ x: 0, y: 0, scale: 1 });
    setHoveredEdge(null);
    setHoveredNodeId(null);
  };

  return (
    <div className={styles.readingsExperience}>
      <ReadingsFilters
        threads={readingThreads}
        filter={filter}
        showSourceNodes={showSourceNodes}
        onFilterChange={setFilter}
        onShowSourceNodesChange={setShowSourceNodes}
      />
      <div className={styles.graphLayout}>
        <section
          className={`${styles.graphCard} card`}
          aria-label="Reading relationship graph"
        >
          <div className={styles.graphToolbar}>
            <ReadingsLegend />
            <button
              type="button"
              className={styles.resetButton}
              onClick={resetGraph}
            >
              Reset view
            </button>
          </div>
          <p className={styles.graphCount}>
            Reading map · {filteredReadings.length} readings
          </p>
          <div className={styles.graphViewport}>
            {visibleNodes.length > 0 ? (
              <svg
                className={styles.graphSvg}
                viewBox={`0 0 ${coordinateWidth} ${READING_GRAPH_HEIGHT}`}
                role="group"
                aria-label="Readings and sources graph"
                onPointerDown={startPan}
                onPointerMove={moveGraphPointer}
                onPointerUp={endGraphPointer}
                onPointerCancel={endGraphPointer}
                onWheel={zoomGraph}
                onClick={(event) => {
                  if (event.target === event.currentTarget) setSelectedId(null);
                }}
              >
                <g
                  transform={`translate(${view.x} ${view.y}) scale(${view.scale})`}
                >
                  <g aria-hidden="true">
                    {visibleEdges.map((edge, index) => {
                      const from = renderedNodes.find(
                        ({ id }) => id === edge.source,
                      )!;
                      const to = renderedNodes.find(
                        ({ id }) => id === edge.target,
                      )!;
                      const sourceEdge = from.kind === "source";
                      const selectedConnection =
                        selectedId === from.id || selectedId === to.id;
                      const middleX = (from.x + to.x) / 2;
                      const middleY = (from.y + to.y) / 2;
                      const edgeKey = `${edge.source}:${edge.target}:${edge.label ?? ""}`;
                      const showLabel =
                        selectedConnection || hoveredEdge === edgeKey;
                      return (
                        <g
                          key={`${edge.source}-${edge.target}-${index}`}
                          onPointerEnter={() => setHoveredEdge(edgeKey)}
                          onPointerLeave={() => setHoveredEdge(null)}
                        >
                          <line
                            className={styles.edgeHit}
                            x1={from.x}
                            y1={from.y}
                            x2={to.x}
                            y2={to.y}
                          />
                          <line
                            x1={from.x}
                            y1={from.y}
                            x2={to.x}
                            y2={to.y}
                            className={`${styles.edge} ${sourceEdge ? styles.sourceEdge : ""} ${selectedConnection ? styles.edgeHighlighted : ""}`}
                          />
                          {edge.label && showLabel && (
                            <g className={styles.edgeLabel}>
                              <rect
                                x={
                                  middleX -
                                  Math.max(35, edge.label.length * 3.15)
                                }
                                y={middleY - 9}
                                width={Math.max(70, edge.label.length * 6.3)}
                                height="18"
                                rx="8"
                              />
                              <text
                                x={middleX}
                                y={middleY + 3}
                                textAnchor="middle"
                              >
                                {edge.label}
                              </text>
                            </g>
                          )}
                        </g>
                      );
                    })}
                  </g>
                  {renderedNodes.map((node, index) => {
                    const isSelected = selectedId === node.id;
                    const related = relatedNodeIds.has(node.id);
                    if (node.kind === "source") {
                      const sourceRadius = getReadingGraphNodeRadius("source", {
                        selected: isSelected,
                      });
                      const sourceLines = wrapLabel(node.label, 18);
                      const labelPosition = labelPositions.get(node.id);
                      return (
                        <g
                          key={node.id}
                          role="button"
                          tabIndex={0}
                          aria-label={`Source: ${node.label}`}
                          aria-pressed={isSelected}
                          className={`${styles.graphNode} ${styles.sourceNode} ${isSelected ? styles.nodeSelected : ""} ${related ? styles.nodeRelated : ""} ${selectedId && !related && !isSelected ? styles.nodeDimmed : ""}`}
                          style={{
                            animationDelay: `${Math.min(index * 24, 350)}ms`,
                          }}
                          onPointerDown={(event) =>
                            startNodeDrag(event, node.id)
                          }
                          onPointerEnter={() => setHoveredNodeId(node.id)}
                          onPointerLeave={() => setHoveredNodeId(null)}
                          onFocus={() => setHoveredNodeId(node.id)}
                          onBlur={() => setHoveredNodeId(null)}
                          onClick={() => {
                            if (skipClick.current) {
                              skipClick.current = false;
                              return;
                            }
                            setSelectedId(node.id);
                          }}
                          onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === " ") {
                              event.preventDefault();
                              setSelectedId(node.id);
                            }
                          }}
                        >
                          <title>{node.label}</title>
                          <circle cx={node.x} cy={node.y} r={sourceRadius} />
                          {showSourceNodes && labelPosition && (
                            <text
                              className={styles.sourceLabel}
                              x={labelPosition.x}
                              y={
                                labelPosition.y - labelPosition.height / 2 + 20
                              }
                              textAnchor={labelPosition.anchor}
                            >
                              {sourceLines.map((line, lineIndex) => (
                                <tspan
                                  key={lineIndex}
                                  x={labelPosition.x}
                                  dy={lineIndex === 0 ? 0 : 22}
                                >
                                  {line}
                                </tspan>
                              ))}
                            </text>
                          )}
                        </g>
                      );
                    }
                    const readingRadius = getReadingGraphNodeRadius("reading", {
                      important: node.reading?.importance === 3,
                      selected: isSelected,
                    });
                    const labelPosition = labelPositions.get(node.id);
                    const selectedLabelPosition = isSelected
                      ? placeSelectedReadingLabel(
                          node,
                          coordinateWidth,
                          READING_GRAPH_HEIGHT,
                        )
                      : undefined;
                    const readingTitleLines = wrapLabel(node.label, 22);
                    return (
                      <g
                        key={node.id}
                        role="button"
                        tabIndex={0}
                        aria-label={`Reading: ${node.label} by ${node.author}`}
                        aria-pressed={isSelected}
                        className={`${styles.graphNode} ${styles.readingNode} ${isSelected ? styles.nodeSelected : ""} ${related ? styles.nodeRelated : ""} ${selectedId && !related && !isSelected ? styles.nodeDimmed : ""}`}
                        style={{
                          animationDelay: `${Math.min(index * 24, 350)}ms`,
                        }}
                        onPointerDown={(event) => startNodeDrag(event, node.id)}
                        onPointerEnter={() => setHoveredNodeId(node.id)}
                        onPointerLeave={() => setHoveredNodeId(null)}
                        onFocus={() => setHoveredNodeId(node.id)}
                        onBlur={() => setHoveredNodeId(null)}
                        onClick={() => {
                          if (skipClick.current) {
                            skipClick.current = false;
                            return;
                          }
                          setSelectedId(node.id);
                        }}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            setSelectedId(node.id);
                          }
                        }}
                      >
                        <title>{`${node.label} — ${node.author}`}</title>
                        <circle cx={node.x} cy={node.y} r={readingRadius} />
                        {selectedLabelPosition ? (
                          <foreignObject
                            className={styles.selectedReadingLabel}
                            data-selected-reading-label={node.id}
                            x={selectedLabelPosition.x}
                            y={selectedLabelPosition.y}
                            width={selectedLabelPosition.width}
                            height={selectedLabelPosition.height}
                          >
                            <div
                              className={`${styles.selectedReadingLabelBlock} ${
                                selectedLabelPosition.side === "left"
                                  ? styles.selectedReadingLabelLeft
                                  : styles.selectedReadingLabelRight
                              }`}
                            >
                              <p className={styles.selectedReadingLabelTitle}>
                                {node.label}
                              </p>
                              <p className={styles.selectedReadingLabelAuthor}>
                                {node.author}
                              </p>
                            </div>
                          </foreignObject>
                        ) : labelPosition ? (
                          <g className={styles.readingLabel}>
                            <text
                              className={styles.readingLabelTitle}
                              x={labelPosition.x}
                              y={labelPosition.y - 30}
                              textAnchor={labelPosition.anchor}
                            >
                              {readingTitleLines.map((line, lineIndex) => (
                                <tspan
                                  key={lineIndex}
                                  x={labelPosition.x}
                                  dy={lineIndex === 0 ? 0 : 34}
                                >
                                  {line}
                                </tspan>
                              ))}
                            </text>
                            <text
                              className={styles.readingLabelAuthor}
                              x={labelPosition.x}
                              y={labelPosition.y + 39}
                              textAnchor={labelPosition.anchor}
                            >
                              {clampLabel(node.author ?? "")}
                            </text>
                          </g>
                        ) : null}
                      </g>
                    );
                  })}
                </g>
              </svg>
            ) : (
              <p className={styles.noResults}>
                No readings match these filters.
              </p>
            )}
          </div>
        </section>
        <ReadingsPanel
          selected={selectedDetail}
          readings={readings}
          threads={readingThreads}
          edges={readingEdges}
          onClose={() => setSelectedId(null)}
        />
      </div>
      <p className={styles.resultCount} aria-live="polite">
        Showing {filteredReadings.length} of {readings.length} readings
      </p>
    </div>
  );
}
