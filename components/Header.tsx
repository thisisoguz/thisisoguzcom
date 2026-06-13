import Link from "next/link";
import { BrandName } from "@/components/BrandName";
import { HeaderNavigation } from "@/components/HeaderNavigation";

export function Header() {
  return (
    <header className="site-header">
      <div className="header-bar">
        <Link className="brand" href="/"><BrandName /></Link>
        <HeaderNavigation />
      </div>
    </header>
  );
}
