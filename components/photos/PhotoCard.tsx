import Image from "next/image";
import type { Dispatch, SetStateAction } from "react";
import type { Photo } from "@/content/photos";
import { PhotoMeta } from "@/components/photos/PhotoMeta";

export function PhotoCard({ photo, index, setActiveIndex }: { photo: Photo; index: number; setActiveIndex: Dispatch<SetStateAction<number | null>> }) {
  const alt = photo.description ? `${photo.title}. ${photo.description}` : `${photo.title} photo by Oguz Yilmaz`;

  return (
    <article className="photo-item">
      <button className="photo-tile" type="button" onClick={() => setActiveIndex(index)} aria-label={`Open ${photo.title}`} aria-haspopup="dialog">
        <Image src={photo.thumbnailUrl} alt={alt} fill sizes="(max-width: 639px) 50vw, (max-width: 1023px) 33vw, 25vw" />
      </button>
      <PhotoMeta location={photo.location} takenAtLabel={photo.takenAtLabel} />
    </article>
  );
}
