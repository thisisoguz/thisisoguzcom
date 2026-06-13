export type ReadingNodeType = "book" | "author" | "concept" | "question" | "essay" | "theme";
export type ReadingStatus = "read" | "reading" | "want_to_read";
export type ReadingRelation = "led_to" | "mentions" | "contrasts_with" | "explains" | "same_theme" | "asks" | "reading_reason";

export type ReadingNode = {
  id: string;
  slug: string;
  type: ReadingNodeType;
  title: string;
  subtitle: string;
  description: string;
  status: ReadingStatus;
  tags: string[];
};

export type ReadingEdge = {
  id: string;
  sourceId: string;
  targetId: string;
  relation: ReadingRelation;
  note: string;
  strength: number;
};

export const readingNodes: ReadingNode[] = [
  { id: "missed", slug: "kacirdiklarimiz", type: "book", title: "Kaçırdıklarımız", subtitle: "Adam Phillips", description: "Notes on unlived lives, choices and the stories built around what did not happen.", status: "reading", tags: ["desire", "possibility"] },
  { id: "frustration", slug: "frustration", type: "concept", title: "Frustration", subtitle: "A recurring idea", description: "What does frustration tell us about the shape of a wish?", status: "reading", tags: ["desire", "limits"] },
  { id: "satisfaction", slug: "satisfaction", type: "question", title: "Satisfaction", subtitle: "A question", description: "Would getting exactly what we wanted settle anything?", status: "want_to_read", tags: ["desire", "questions"] },
  { id: "othello", slug: "othello", type: "book", title: "Othello", subtitle: "William Shakespeare", description: "Jealousy, certainty and the damage caused by a story believed too quickly.", status: "read", tags: ["jealousy", "theatre"] },
  { id: "lear", slug: "king-lear", type: "book", title: "King Lear", subtitle: "William Shakespeare", description: "A return to love, authority, blindness and what cannot be measured.", status: "want_to_read", tags: ["family", "theatre"] },
  { id: "freud", slug: "freud", type: "author", title: "Freud", subtitle: "Writer and analyst", description: "A path into slips, wishes and the limits of conscious explanation.", status: "want_to_read", tags: ["psychoanalysis"] },
  { id: "unconscious", slug: "unconscious", type: "concept", title: "The unconscious", subtitle: "A working concept", description: "Things we say and do without fully knowing why.", status: "reading", tags: ["psychoanalysis"] },
  { id: "breakups", slug: "kopuslar", type: "book", title: "Kopuşlar", subtitle: "Claire Marin", description: "A book about breaks, departures and the ways a life changes form.", status: "want_to_read", tags: ["change", "loss"] },
];

export const readingEdges: ReadingEdge[] = [
  { id: "e1", sourceId: "missed", targetId: "frustration", relation: "led_to", note: "A missed life often appears first as frustration.", strength: 3 },
  { id: "e2", sourceId: "frustration", targetId: "satisfaction", relation: "asks", note: "Frustration raises the question of what would satisfy us.", strength: 2 },
  { id: "e3", sourceId: "missed", targetId: "freud", relation: "mentions", note: "Phillips keeps opening doors back to Freud.", strength: 2 },
  { id: "e4", sourceId: "freud", targetId: "unconscious", relation: "explains", note: "The concept sits at the center of the work.", strength: 3 },
  { id: "e5", sourceId: "othello", targetId: "lear", relation: "same_theme", note: "Different forms of blindness and certainty.", strength: 1 },
  { id: "e6", sourceId: "breakups", targetId: "missed", relation: "contrasts_with", note: "Breaking away changes which unlived life we imagine.", strength: 2 },
];
