import { Hero } from "@/components/Hero";
import { createMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata = createMetadata({ title: siteConfig.title, description: siteConfig.description });

export default function HomePage() { return <Hero />; }
