export type ReadingFormat = "book" | "essay" | "article" | "lecture";
export type ReadingStatus = "read" | "reading" | "to-read" | "dnf";
export type ReadingSourceType =
  | "book-club"
  | "person"
  | "friend"
  | "film"
  | "platform"
  | "place"
  | "self"
  | "previous-reading";

export type ReadingItem = {
  id: string;
  title: string;
  localizedTitle?: string;
  originalTitle?: string;
  author: string;
  format: ReadingFormat;
  status: ReadingStatus;
  dateLabel?: string;
  sortDate?: string;
  rating?: number;
  importance?: 1 | 2 | 3;
  discoveredVia?: string;
  discoveredViaType?: ReadingSourceType;
  primarySourceId?: string;
  sourceIds?: string[];
  themes: string[];
  threadIds?: string[];
  relatedTo: string[];
  whyRead?: string;
  note?: string;
};

export type ReadingSource = {
  id: string;
  title: string;
  sourceType: ReadingSourceType;
  description?: string;
  showAsNode?: boolean;
};

export type ReadingThread = {
  id: string;
  title: string;
  description?: string;
  themeIds: string[];
  year?: string;
};
export type ReadingEdge = {
  source: string;
  target: string;
  relation:
    | "recommended-by"
    | "book-club"
    | "similar-theme"
    | "follow-up"
    | "same-author"
    | "read-after"
    | "bridge"
    | "source-to-reading";
  label?: string;
  strength?: 1 | 2 | 3;
};

export const readingSources: ReadingSource[] = [
  {
    id: "literary-lab-book-club",
    title: "Literary Lab Book Club",
    sourceType: "book-club",
    showAsNode: true,
    description: "A recurring book club source in my reading archive.",
  },
  {
    id: "artemis-book-club",
    title: "Artemis Book Club",
    sourceType: "book-club",
    showAsNode: true,
    description: "A recurring book club source in my reading archive.",
  },
  {
    id: "self-directed",
    title: "Self-directed curiosity",
    sourceType: "self",
    showAsNode: false,
    description:
      "Readings that started from personal curiosity rather than a specific external recommendation.",
  },
];

export const readingThreads: ReadingThread[] = [
  {
    id: "fatigue-modernity-attention",
    title: "Fatigue / modernity / attention",
    themeIds: ["fatigue", "modernity", "attention"],
  },
  {
    id: "women-body-interiority",
    title: "Women / body / interiority",
    themeIds: ["women", "body", "interiority"],
  },
  {
    id: "alienation-shame-fragmentation",
    title: "Alienation / shame / fragmentation",
    themeIds: ["alienation", "shame", "fragmentation"],
  },
  {
    id: "death-mortality-wisdom",
    title: "Death / mortality / wisdom",
    themeIds: ["death", "mortality", "wisdom"],
  },
  {
    id: "turkish-literature-memory",
    title: "Turkish literature / memory",
    themeIds: ["turkish-literature", "memory"],
  },
];

export const readings: ReadingItem[] = [
  {
    id: "the-vegetarian",
    title: "The Vegetarian",
    localizedTitle: "Vejetaryen",
    author: "Han Kang",
    format: "book",
    status: "read",
    importance: 3,
    discoveredVia: "Literary Lab Book Club",
    discoveredViaType: "book-club",
    primarySourceId: "literary-lab-book-club",
    sourceIds: ["literary-lab-book-club"],
    themes: ["body", "women", "transformation", "resistance"],
    threadIds: ["women-body-interiority"],
    relatedTo: [
      "the-dark-daughter",
      "a-room-of-ones-own",
      "frankenstein-modern-prometheus",
    ],
  },
  {
    id: "the-burnout-society",
    title: "The Burnout Society",
    localizedTitle: "Yorgunluk Toplumu",
    author: "Byung-Chul Han",
    format: "book",
    status: "read",
    importance: 3,
    discoveredVia: "Self-directed curiosity",
    discoveredViaType: "self",
    themes: ["fatigue", "modernity", "work", "attention"],
    threadIds: ["fatigue-modernity-attention"],
    relatedTo: ["stolen-focus", "the-corrosion-of-character"],
  },
  {
    id: "stolen-focus",
    title: "Stolen Focus",
    localizedTitle: "Çalınan Dikkat: Neden Odaklanamıyoruz?",
    author: "Johann Hari",
    format: "book",
    status: "read",
    importance: 2,
    discoveredVia: "Self-directed curiosity",
    discoveredViaType: "self",
    themes: ["attention", "technology", "modernity"],
    threadIds: ["fatigue-modernity-attention"],
    relatedTo: ["the-burnout-society"],
  },
  {
    id: "the-corrosion-of-character",
    title: "The Corrosion of Character",
    localizedTitle: "Karakter Aşınması",
    author: "Richard Sennett",
    format: "book",
    status: "read",
    importance: 2,
    discoveredVia: "Self-directed curiosity",
    discoveredViaType: "self",
    themes: ["work", "modernity", "identity"],
    threadIds: ["fatigue-modernity-attention"],
    relatedTo: ["the-burnout-society"],
  },
  {
    id: "a-room-of-ones-own",
    title: "A Room of One's Own",
    localizedTitle: "Kendine Ait Bir Oda",
    author: "Virginia Woolf",
    format: "essay",
    status: "read",
    importance: 3,
    discoveredVia: "Literary Lab Book Club",
    discoveredViaType: "book-club",
    primarySourceId: "literary-lab-book-club",
    sourceIds: ["literary-lab-book-club"],
    themes: ["women", "interiority", "creativity"],
    threadIds: ["women-body-interiority"],
    relatedTo: ["the-vegetarian"],
  },
  {
    id: "disgrace",
    title: "Disgrace",
    localizedTitle: "Utanç",
    author: "J. M. Coetzee",
    format: "book",
    status: "read",
    importance: 2,
    discoveredVia: "Artemis Book Club",
    discoveredViaType: "book-club",
    primarySourceId: "artemis-book-club",
    sourceIds: ["artemis-book-club"],
    themes: ["shame", "power", "alienation"],
    threadIds: ["alienation-shame-fragmentation"],
    relatedTo: ["no-longer-human"],
  },
  {
    id: "no-longer-human",
    title: "No Longer Human",
    localizedTitle: "İnsanlığımı Yitirirken",
    author: "Osamu Dazai",
    format: "book",
    status: "read",
    importance: 2,
    discoveredVia: "Self-directed curiosity",
    discoveredViaType: "self",
    themes: ["alienation", "shame", "identity"],
    threadIds: ["alienation-shame-fragmentation"],
    relatedTo: ["disgrace", "the-woman-in-the-dunes"],
  },
  {
    id: "the-woman-in-the-dunes",
    title: "The Woman in the Dunes",
    localizedTitle: "Kumların Kadını",
    author: "Kōbō Abe",
    format: "book",
    status: "read",
    importance: 2,
    discoveredVia: "Self-directed curiosity",
    discoveredViaType: "self",
    themes: ["alienation", "freedom", "identity"],
    threadIds: ["alienation-shame-fragmentation"],
    relatedTo: ["no-longer-human"],
  },
  {
    id: "death-with-interruptions",
    title: "Death with Interruptions",
    localizedTitle: "Ölüm Bir Varmış Bir Yokmuş",
    author: "José Saramago",
    format: "book",
    status: "read",
    importance: 2,
    discoveredVia: "Artemis Book Club",
    discoveredViaType: "book-club",
    primarySourceId: "artemis-book-club",
    sourceIds: ["artemis-book-club"],
    themes: ["death", "mortality", "society"],
    threadIds: ["death-mortality-wisdom"],
    relatedTo: ["the-gardener-and-death"],
  },
  {
    id: "the-gardener-and-death",
    title: "The Gardener and Death",
    localizedTitle: "Bahçıvan ve Ölüm",
    author: "Georgi Gospodinov",
    format: "book",
    status: "read",
    importance: 2,
    discoveredVia: "Self-directed curiosity",
    discoveredViaType: "self",
    themes: ["death", "mortality", "memory", "family"],
    threadIds: ["death-mortality-wisdom"],
    relatedTo: ["death-with-interruptions"],
  },
  {
    id: "the-legend-of-mount-ararat",
    title: "The Legend of Mount Ararat",
    localizedTitle: "Ağrı Dağı Efsanesi",
    author: "Yaşar Kemal",
    format: "book",
    status: "read",
    importance: 2,
    discoveredVia: "Artemis Book Club",
    discoveredViaType: "book-club",
    primarySourceId: "artemis-book-club",
    sourceIds: ["artemis-book-club"],
    themes: ["turkish-literature", "memory", "legend"],
    threadIds: ["turkish-literature-memory"],
    relatedTo: ["deli-ibrams-divan"],
  },
  {
    id: "deli-ibrams-divan",
    title: "Deli İbram's Divan",
    localizedTitle: "Deli İbram Divanı",
    author: "Ahmet Büke",
    format: "book",
    status: "read",
    importance: 2,
    discoveredVia: "Artemis Book Club",
    discoveredViaType: "book-club",
    primarySourceId: "artemis-book-club",
    sourceIds: ["artemis-book-club"],
    themes: ["turkish-literature", "memory", "belonging"],
    threadIds: ["turkish-literature-memory"],
    relatedTo: ["the-legend-of-mount-ararat"],
  },
  {
    id: "the-dark-daughter",
    title: "The Dark Daughter",
    localizedTitle: "Karanlık Kız",
    author: "Elena Ferrante",
    format: "book",
    status: "read",
    importance: 2,
    discoveredVia: "Self-directed curiosity",
    discoveredViaType: "self",
    themes: ["women", "motherhood", "body", "interiority"],
    threadIds: ["women-body-interiority"],
    relatedTo: ["the-vegetarian"],
  },
  {
    id: "frankenstein-modern-prometheus",
    title: "Frankenstein; or, The Modern Prometheus",
    localizedTitle: "Frankenstein ya da Modern Prometheus",
    author: "Mary Shelley",
    format: "book",
    status: "read",
    importance: 2,
    discoveredVia: "Self-directed curiosity",
    discoveredViaType: "self",
    themes: ["body", "transformation", "creation", "responsibility"],
    threadIds: ["women-body-interiority"],
    relatedTo: ["the-vegetarian"],
  },
  {
    id: "ward-no-6",
    title: "Ward No. 6",
    localizedTitle: "Altıncı Koğuş",
    author: "Anton Chekhov",
    format: "book",
    status: "read",
    importance: 2,
    discoveredVia: "Artemis Book Club",
    discoveredViaType: "book-club",
    primarySourceId: "artemis-book-club",
    sourceIds: ["artemis-book-club"],
    themes: ["isolation", "power", "sanity"],
    threadIds: ["alienation-shame-fragmentation"],
    relatedTo: [],
  },
  {
    id: "better-than-optimism",
    title: "Better Than Optimism",
    localizedTitle: "İyimserlikten Daha İyisi",
    author: "Guillaume Paoli",
    format: "book",
    status: "read",
    themes: ["optimism", "philosophy", "modernity"],
    threadIds: ["fatigue-modernity-attention"],
    relatedTo: [],
  },
  {
    id: "women-without-men",
    title: "Women Without Men",
    localizedTitle: "Erkeksiz Kadınlar",
    author: "Shahrnush Parsipur",
    format: "book",
    status: "read",
    discoveredVia: "Literary Lab Book Club",
    discoveredViaType: "book-club",
    primarySourceId: "literary-lab-book-club",
    sourceIds: ["literary-lab-book-club"],
    themes: ["women", "freedom", "body"],
    threadIds: ["women-body-interiority"],
    relatedTo: [],
  },
  {
    id: "missing-out-unlived-life",
    title: "Missing Out: In Praise of the Unlived Life",
    localizedTitle: "Kaçırdıklarımız: Yaşanmamış Hayata Övgü",
    author: "Adam Phillips",
    format: "book",
    status: "read",
    themes: ["desire", "possibility", "interiority"],
    threadIds: ["fatigue-modernity-attention"],
    relatedTo: [],
  },
  {
    id: "being-human",
    title: "Being Human",
    localizedTitle: "İnsan Olmak",
    author: "Engin Geçtan",
    format: "book",
    status: "read",
    themes: ["identity", "interiority", "human-nature"],
    threadIds: ["alienation-shame-fragmentation"],
    relatedTo: [],
  },
  {
    id: "yoldan-cikanlar",
    title: "Yoldan Çıkanlar",
    localizedTitle: "Yoldan Çıkanlar",
    author: "Guadalupe Nettel",
    format: "book",
    status: "read",
    themes: ["identity", "belonging", "interiority"],
    threadIds: ["alienation-shame-fragmentation"],
    relatedTo: [],
  },
  {
    id: "on-the-firmness-of-the-wise",
    title: "On the Firmness of the Wise",
    localizedTitle: "Bilgeliğin Sarsılmazlığı Üzerine",
    author: "Seneca",
    format: "book",
    status: "read",
    themes: ["wisdom", "philosophy", "resilience"],
    threadIds: ["death-mortality-wisdom"],
    relatedTo: [],
  },
  {
    id: "buyu",
    title: "Büyü",
    localizedTitle: "Büyü",
    author: "Nihan Kaya",
    format: "book",
    status: "read",
    discoveredVia: "Literary Lab Book Club",
    discoveredViaType: "book-club",
    primarySourceId: "literary-lab-book-club",
    sourceIds: ["literary-lab-book-club"],
    themes: ["women", "family", "interiority"],
    threadIds: ["women-body-interiority"],
    relatedTo: [],
  },
  {
    id: "tante-rosa",
    title: "Tante Rosa",
    localizedTitle: "Tante Rosa",
    author: "Sevgi Soysal",
    format: "book",
    status: "read",
    discoveredVia: "Literary Lab Book Club",
    discoveredViaType: "book-club",
    primarySourceId: "literary-lab-book-club",
    sourceIds: ["literary-lab-book-club"],
    themes: ["women", "identity", "turkish-literature"],
    threadIds: ["women-body-interiority", "turkish-literature-memory"],
    relatedTo: [],
  },
  {
    id: "the-white-castle",
    title: "The White Castle",
    localizedTitle: "Beyaz Kale",
    author: "Orhan Pamuk",
    format: "book",
    status: "read",
    themes: ["identity", "memory", "turkish-literature"],
    threadIds: ["turkish-literature-memory"],
    relatedTo: [],
  },
  {
    id: "the-devil-within",
    title: "The Devil Within",
    localizedTitle: "İçimizdeki Şeytan",
    author: "Sabahattin Ali",
    format: "book",
    status: "read",
    themes: ["identity", "morality", "turkish-literature"],
    threadIds: ["turkish-literature-memory", "alienation-shame-fragmentation"],
    relatedTo: [],
  },
  {
    id: "one-peach-a-thousand-peaches",
    title: "One Peach, A Thousand Peaches",
    localizedTitle: "Bir Şeftali Bin Şeftali",
    author: "Samad Behrangi",
    format: "book",
    status: "read",
    themes: ["justice", "belonging", "resistance"],
    threadIds: ["turkish-literature-memory"],
    relatedTo: [],
  },
  {
    id: "chronicle-of-a-death-foretold",
    title: "Chronicle of a Death Foretold",
    localizedTitle: "Kırmızı Pazartesi",
    author: "Gabriel García Márquez",
    format: "book",
    status: "read",
    themes: ["death", "memory", "society"],
    threadIds: ["death-mortality-wisdom"],
    relatedTo: [],
  },
  {
    id: "to-live",
    title: "To Live",
    localizedTitle: "Yaşamak",
    author: "Yu Hua",
    format: "book",
    status: "read",
    themes: ["mortality", "resilience", "family"],
    threadIds: ["death-mortality-wisdom"],
    relatedTo: [],
  },
  {
    id: "the-great-passage",
    title: "The Great Passage",
    localizedTitle: "Seyrüsefer",
    author: "Shion Miura",
    format: "book",
    status: "read",
    themes: ["language", "work", "community"],
    threadIds: ["fatigue-modernity-attention"],
    relatedTo: [],
  },
  {
    id: "the-house-of-paper",
    title: "The House of Paper",
    localizedTitle: "Kağıt Ev",
    author: "Carlos María Domínguez",
    format: "book",
    status: "read",
    themes: ["books", "obsession", "identity"],
    threadIds: ["alienation-shame-fragmentation"],
    relatedTo: [],
  },
  {
    id: "the-hunchback",
    title: "The Hunchback",
    localizedTitle: "Kambur",
    author: "Şule Gürbüz",
    format: "book",
    status: "read",
    themes: ["alienation", "interiority", "turkish-literature"],
    threadIds: ["alienation-shame-fragmentation", "turkish-literature-memory"],
    relatedTo: [],
  },
  {
    id: "raoul-taburin",
    title: "Raoul Taburin",
    localizedTitle: "Raoul Taburin",
    author: "Jean-Jacques Sempé",
    format: "book",
    status: "read",
    themes: ["identity", "secrets", "belonging"],
    threadIds: ["alienation-shame-fragmentation"],
    relatedTo: [],
  },
  {
    id: "woman-at-point-zero",
    title: "Woman at Point Zero",
    localizedTitle: "Sıfır Noktasındaki Kadın",
    author: "Nawal El Saadawi",
    format: "book",
    status: "read",
    discoveredVia: "Literary Lab Book Club",
    discoveredViaType: "book-club",
    primarySourceId: "literary-lab-book-club",
    sourceIds: ["literary-lab-book-club"],
    themes: ["women", "power", "body", "resistance"],
    threadIds: ["women-body-interiority"],
    relatedTo: [],
  },
  {
    id: "a-season-in-hakkari",
    title: "A Season in Hakkari",
    localizedTitle: "Hakkâri’de Bir Mevsim",
    author: "Ferit Edgü",
    format: "book",
    status: "read",
    themes: ["isolation", "place", "turkish-literature"],
    threadIds: ["turkish-literature-memory", "alienation-shame-fragmentation"],
    relatedTo: [],
  },
];

export const readingEdges: ReadingEdge[] = [
  {
    source: "literary-lab-book-club",
    target: "the-vegetarian",
    relation: "source-to-reading",
    label: "book club",
  },
  {
    source: "literary-lab-book-club",
    target: "a-room-of-ones-own",
    relation: "source-to-reading",
    label: "book club",
  },
  {
    source: "literary-lab-book-club",
    target: "women-without-men",
    relation: "source-to-reading",
    label: "book club",
  },
  {
    source: "literary-lab-book-club",
    target: "buyu",
    relation: "source-to-reading",
    label: "book club",
  },
  {
    source: "literary-lab-book-club",
    target: "tante-rosa",
    relation: "source-to-reading",
    label: "book club",
  },
  {
    source: "literary-lab-book-club",
    target: "woman-at-point-zero",
    relation: "source-to-reading",
    label: "book club",
  },
  {
    source: "artemis-book-club",
    target: "disgrace",
    relation: "source-to-reading",
    label: "book club",
  },
  {
    source: "artemis-book-club",
    target: "death-with-interruptions",
    relation: "source-to-reading",
    label: "book club",
  },
  {
    source: "artemis-book-club",
    target: "the-legend-of-mount-ararat",
    relation: "source-to-reading",
    label: "book club",
  },
  {
    source: "artemis-book-club",
    target: "deli-ibrams-divan",
    relation: "source-to-reading",
    label: "book club",
  },
  {
    source: "artemis-book-club",
    target: "ward-no-6",
    relation: "source-to-reading",
    label: "book club",
  },
  {
    source: "the-vegetarian",
    target: "the-dark-daughter",
    relation: "similar-theme",
    label: "body / women",
    strength: 3,
  },
  {
    source: "the-vegetarian",
    target: "a-room-of-ones-own",
    relation: "similar-theme",
    label: "body / women",
    strength: 2,
  },
  {
    source: "the-burnout-society",
    target: "stolen-focus",
    relation: "bridge",
    label: "attention / modernity",
    strength: 3,
  },
  {
    source: "the-burnout-society",
    target: "the-corrosion-of-character",
    relation: "similar-theme",
    label: "work / modernity",
    strength: 2,
  },
  {
    source: "disgrace",
    target: "no-longer-human",
    relation: "similar-theme",
    label: "shame / alienation",
    strength: 2,
  },
  {
    source: "no-longer-human",
    target: "the-woman-in-the-dunes",
    relation: "similar-theme",
    label: "alienation",
    strength: 2,
  },
  {
    source: "death-with-interruptions",
    target: "the-gardener-and-death",
    relation: "similar-theme",
    label: "death",
    strength: 2,
  },
  {
    source: "the-legend-of-mount-ararat",
    target: "deli-ibrams-divan",
    relation: "similar-theme",
    label: "Turkish literature",
    strength: 2,
  },
  {
    source: "frankenstein-modern-prometheus",
    target: "the-vegetarian",
    relation: "bridge",
    label: "body / transformation",
    strength: 1,
  },
];
