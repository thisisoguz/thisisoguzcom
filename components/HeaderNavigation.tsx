"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/experience", label: "Experience" },
  { href: "/readings", label: "Readings" },
  { href: "/photos", label: "Photos" },
];

export function HeaderNavigation() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileNavRef = useRef<HTMLElement>(null);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;

    const close = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!menuButtonRef.current?.contains(target) && !mobileNavRef.current?.contains(target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  return (
    <>
      <nav className="desktop-nav" aria-label="Main navigation">
        {links.map((link) => <NavLink key={link.href} {...link} active={pathname === link.href} />)}
      </nav>
      <button
        ref={menuButtonRef}
        className="menu-button"
        type="button"
        aria-label={`${open ? "Close" : "Open"} navigation menu`}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span /><span />
      </button>
      {open && (
        <nav ref={mobileNavRef} className="mobile-nav" aria-label="Mobile navigation">
          {links.map((link) => <NavLink key={link.href} {...link} active={pathname === link.href} />)}
        </nav>
      )}
    </>
  );
}

function NavLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  return <Link href={href} aria-current={active ? "page" : undefined} className={active ? "active" : ""}>{label}</Link>;
}
