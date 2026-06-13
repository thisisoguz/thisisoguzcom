import type { ReactNode } from "react";

export function PageShell({ title, intro, children, wide = false, className = "" }: { title: string; intro: string; children: ReactNode; wide?: boolean; className?: string }) {
  return (
    <main className={`page-shell ${wide ? "page-shell--wide" : ""} ${className}`.trim()}>
      <header>
        <h1>{title}</h1>
        <p className="page-intro">{intro}</p>
      </header>
      {children}
    </main>
  );
}
