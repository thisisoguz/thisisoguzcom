"use client";

import { lazy, Suspense, useCallback, useState } from "react";
import type { Photo } from "@/content/photos";
import { PhotoCard } from "@/components/photos/PhotoCard";

const PhotoLightbox = lazy(async () => {
  const lightboxModule = await import("@/components/photos/PhotoLightbox");
  return { default: lightboxModule.PhotoLightbox };
});

export function PhotoGrid({ photos }: { photos: Photo[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const closeLightbox = useCallback(() => setActiveIndex(null), []);
  const previousPhoto = useCallback(() => {
    setActiveIndex((current) => current === null ? 0 : (current - 1 + photos.length) % photos.length);
  }, [photos.length]);
  const nextPhoto = useCallback(() => {
    setActiveIndex((current) => current === null ? 0 : (current + 1) % photos.length);
  }, [photos.length]);

  return (
    <>
      <div className="photo-grid">
        {photos.map((photo, index) => (
          <PhotoCard key={photo.id} photo={photo} index={index} setActiveIndex={setActiveIndex} />
        ))}
      </div>
      {activeIndex !== null && (
        <Suspense fallback={null}>
          <PhotoLightbox
            photos={photos}
            activeIndex={activeIndex}
            onClose={closeLightbox}
            onNext={nextPhoto}
            onPrevious={previousPhoto}
          />
        </Suspense>
      )}
    </>
  );
}
