# Adding photos

Original source images should not be served directly by the website. Convert each image to an optimized JPG or WebP before placing it under `public/photos`.

Use a city-based folder structure:

```text
public/photos/athens/athens-01.jpg
public/photos/istanbul/istanbul-01.jpg
public/photos/berlin/berlin-01.jpg
```

For detail images, keep the longest edge around 2200px when practical. Smaller thumbnail variants can be added later by setting a separate `thumbnailUrl` in the photo data.

Before publishing, strip EXIF metadata, especially GPS coordinates and device information. Work on an exported copy rather than the only original.

To publish a photo:

1. Convert the original image to JPG or WebP.
2. Put the converted file in `public/photos/<city>/`.
3. Add one object to `content/photos.ts`.
4. Set `imageUrl` and `thumbnailUrl` to public paths beginning with `/photos/`.
5. Fill in `city`, `country`, `location`, and `takenAtLabel` consistently.

New cities and photos require no component changes.
