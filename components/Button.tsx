import Link from "next/link";
import type { ReactNode } from "react";

export function Button({ href, children, variant = "primary" }: { href: string; children: ReactNode; variant?: "primary" | "secondary" }) {
  return <Link className={`button button--${variant}`} href={href}><span>{children}</span></Link>;
}
