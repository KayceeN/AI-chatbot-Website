interface BadgePillProps {
  text: string;
  symbol?: string;
  className?: string;
}

export const BadgePill = ({ text, symbol = "✦", className = "" }: BadgePillProps) => {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border border-white/70 bg-panel px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-muted shadow-plate ${className}`.trim()}
    >
      <span>{symbol}</span>
      <span>{text}</span>
    </span>
  );
};
