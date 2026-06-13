import type { ReactNode } from "react";

export function AnimatedGreenText({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <span className={`animated-green-text ${className}`.trim()}>{children}</span>;
}
