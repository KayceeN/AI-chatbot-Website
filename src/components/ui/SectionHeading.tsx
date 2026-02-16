import type { ReactNode } from "react";
import { BadgePill } from "@/components/ui/BadgePill";

interface SectionHeadingProps {
  badge: string;
  title: string;
  subtitle: string;
  icon?: ReactNode;
  align?: "center" | "left";
}

export const SectionHeading = ({ badge, title, subtitle, icon, align = "center" }: SectionHeadingProps) => {
  const textAlign = align === "center" ? "text-center items-center" : "text-left items-start";
  return (
    <div className={`mb-10 flex flex-col gap-4 ${textAlign}`}>
      <BadgePill text={badge} icon={icon} />
      <h2 className="text-balance text-4xl font-semibold tracking-tight text-ink sm:text-6xl">{title}</h2>
      <p className="max-w-2xl text-pretty text-lg text-muted">{subtitle}</p>
    </div>
  );
};
