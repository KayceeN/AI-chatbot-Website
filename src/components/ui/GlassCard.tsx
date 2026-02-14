import type { PropsWithChildren } from "react";

interface GlassCardProps extends PropsWithChildren {
  className?: string;
}

export const GlassCard = ({ children, className = "" }: GlassCardProps) => {
  return (
    <article
      className={`rounded-panel border border-white/75 bg-panel/90 p-6 shadow-soft backdrop-blur-[2px] ${className}`.trim()}
    >
      {children}
    </article>
  );
};
