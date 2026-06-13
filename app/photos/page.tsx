import { PageShell } from "@/components/PageShell";
import { PhotoGrid } from "@/components/photos/PhotoGrid";
import { photos } from "@/content/photos";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({ title: "Photos", description: "A quiet collection of everyday photographs by Oguz Yilmaz.", path: "/photos" });

export default function PhotosPage() {
  return <PageShell wide className="photos-page" title="Photos" intro="Things I noticed and kept. A small collection of photographs from the places I visit."><PhotoGrid photos={photos} /></PageShell>;
}
