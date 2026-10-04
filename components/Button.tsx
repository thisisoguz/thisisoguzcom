import Link from "next/link";
import type { ReactNode } from "react";

export function Button({
  href,
  children,
  variant = "primary",
  download,
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
  download?: string;
}) {
  const className = `button button--${variant}`;

  if (download) {
    return (
      <a className={className} href={href} download={download}>
        <span>{children}</span>
      </a>
    );
  }

  return (
    <Link className={className} href={href}>
      <span>{children}</span>
    </Link>
  );
}
