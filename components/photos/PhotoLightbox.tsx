import Image from "next/image";
import { useEffect, useRef, type CSSProperties } from "react";
import type { Photo } from "@/content/photos";
import { PhotoMeta } from "@/components/photos/PhotoMeta";

export function PhotoLightbox({ photos, activeIndex, onClose, onNext, onPrevious }: { photos: Photo[]; activeIndex: number; onClose: () => void; onNext: () => void; onPrevious: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const photo = photos[activeIndex];
  const alt = photo.description ? `${photo.title}. ${photo.description}` : `${photo.title} photo by Oguz Yilmaz`;
  const frameStyle = { "--photo-aspect": photo.width / photo.height } as CSSProperties;

  useEffect(() => {
    closeRef.current?.focus();
    const initialOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") onPrevious();
      if (event.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = initialOverflow;
    };
  }, [onClose, onNext, onPrevious]);

  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-labelledby="lightbox-title" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <button ref={closeRef} className="lightbox-close" type="button" onClick={onClose} aria-label="Close photo">×</button>
      <button className="lightbox-nav lightbox-prev" type="button" onClick={onPrevious} aria-label="Previous photo">←</button>
      <div className="lightbox-content">
        <div className="lightbox-image-frame" style={frameStyle}>
          <Image className="lightbox-photo" src={photo.imageUrl} alt={alt} width={photo.width} height={photo.height} priority sizes="(max-width: 767px) calc(100vw - 36px), 760px" />
        </div>
        <aside className="lightbox-info">
          <h2 id="lightbox-title">{photo.title}</h2>
          <PhotoMeta location={photo.location} takenAtLabel={photo.takenAtLabel} className="lightbox-meta" />
          {photo.description && <p>{photo.description}</p>}
          <ul className="tag-list" aria-label="Photo tags">{photo.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>
        </aside>
      </div>
      <button className="lightbox-nav lightbox-next" type="button" onClick={onNext} aria-label="Next photo">→</button>
    </div>
  );
}
