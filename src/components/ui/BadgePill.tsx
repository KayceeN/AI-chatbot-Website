import type { ReactNode } from "react";

interface BadgePillProps {
  text: string;
  icon?: ReactNode;
  className?: string;
}

export const BadgePill = ({ text, icon, className = "" }: BadgePillProps) => {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border border-white/70 bg-panel px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-muted shadow-plate ${className}`.trim()}
    >
      {icon && <span className="flex items-center">{icon}</span>}
      <span>{text}</span>
    </span>
  );
};
