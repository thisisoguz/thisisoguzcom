import Image from "next/image";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/PageShell";
import { photos } from "@/content/photos";
import { createMetadata } from "@/lib/seo";

export function generateStaticParams() { return photos.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const photo = photos.find((item) => item.slug === slug);
  return photo ? createMetadata({ title: photo.title, description: photo.description ?? `${photo.title} by Oguz Yilmaz.`, path: `/photos/${photo.slug}` }) : {};
}

export default async function PhotoDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const photo = photos.find((item) => item.slug === slug);
  if (!photo) notFound();
  const description = photo.description ?? `${photo.title} photo by Oguz Yilmaz`;
  return <PageShell title={photo.title} intro={description} wide><div className="experience-list"><article className="card experience-card"><Image src={photo.imageUrl} alt={description} width={photo.width} height={photo.height} sizes="(max-width: 767px) 100vw, 1100px" style={{ width: "100%", height: "auto", borderRadius: 12 }} /><p className="experience-meta">{photo.location} · {photo.takenAtLabel}</p></article></div></PageShell>;
}
