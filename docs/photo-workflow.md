# Photo workflow

Do not reference original iPhone files from page content. Before publishing a photo, export separate variants:

- Thumbnail: 400-600px, used by the grid initially
- Grid: 800-1200px, available for larger grid layouts
- Detail: 1600-2200px, loaded only in the lightbox/detail page
- Original: archive only, never loaded initially

Prefer AVIF or WebP with a JPEG fallback when the production image pipeline supports them. Next.js image optimization will negotiate modern formats for the current JPEG source assets.

Strip EXIF metadata before publishing, especially GPS coordinates and device identifiers. For example, use `exiftool -all= exported-photo.jpg` on an exported copy, then verify with `exiftool exported-photo.jpg`. Never run destructive metadata commands against the only original.
