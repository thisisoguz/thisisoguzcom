export type Photo = {
  id: string;
  slug: string;
  title: string;
  description?: string;
  imageUrl: string;
  thumbnailUrl: string;
  width: number;
  height: number;
  location: string;
  city: string;
  country: string;
  takenAtLabel: string;
  tags: string[];
};

/*
 * To add a new photo:
 * 1. Convert the original HEIC file to JPG or WebP.
 * 2. Put it under public/photos/city-name/photo-name.jpg.
 * 3. Add a new object to this array.
 * 4. Use imageUrl and thumbnailUrl paths starting with /photos/.
 *
 * No photo component changes are needed when adding a city or photo.
 */
export const photos: Photo[] = [
  {
    id: "athens-01",
    slug: "athens-01",
    title: "Athens I",
    description: "A photo I took in Athens.",
    imageUrl: "/photos/athens/athens-01.jpg",
    thumbnailUrl: "/photos/athens/athens-01.jpg",
    width: 2268,
    height: 4032,
    location: "Athens, Greece",
    city: "Athens",
    country: "Greece",
    takenAtLabel: "March, 2026",
    tags: ["athens", "greece", "travel"],
  },
  {
    id: "athens-02",
    slug: "athens-02",
    title: "Athens II",
    description: "A photo I took in Athens.",
    imageUrl: "/photos/athens/athens-02.jpg",
    thumbnailUrl: "/photos/athens/athens-02.jpg",
    width: 2268,
    height: 4032,
    location: "Athens, Greece",
    city: "Athens",
    country: "Greece",
    takenAtLabel: "March, 2026",
    tags: ["athens", "greece", "travel"],
  },
  {
    id: "athens-03",
    slug: "athens-03",
    title: "Athens III",
    description: "A photo I took in Athens.",
    imageUrl: "/photos/athens/athens-03.jpg",
    thumbnailUrl: "/photos/athens/athens-03.jpg",
    width: 2268,
    height: 4032,
    location: "Athens, Greece",
    city: "Athens",
    country: "Greece",
    takenAtLabel: "March, 2026",
    tags: ["athens", "greece", "travel"],
  },
];
