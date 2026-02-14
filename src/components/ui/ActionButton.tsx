import Link from "next/link";
import type { CTA } from "@/content/landing";

interface ActionButtonProps {
  cta: CTA;
  className?: string;
}

export const ActionButton = ({ cta, className = "" }: ActionButtonProps) => {
  const base =
    "inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold tracking-tight transition-all duration-300";

  const variantClass =
    cta.variant === "primary"
      ? "bg-black text-white shadow-button hover:-translate-y-0.5"
      : "bg-panel text-ink shadow-plate hover:-translate-y-0.5";

  return (
    <Link href={cta.href} className={`${base} ${variantClass} ${className}`.trim()}>
      {cta.label}
    </Link>
  );
};
