import Link from "next/link";
import { ActionButton } from "@/components/ui/ActionButton";
import { LogoMark } from "@/components/ui/LogoMark";
import { SectionShell } from "@/components/ui/SectionShell";
import type { LandingPageContent } from "@/content/landing";

interface FooterSectionProps {
  content: LandingPageContent["footer"];
}

export const FooterSection = ({ content }: FooterSectionProps) => {
  return (
    <SectionShell id="footer" className="relative min-h-[70vh] overflow-hidden pb-24">
      <div className="orb-rings" aria-hidden />
      <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-6 rounded-[42px] border border-white/70 bg-white/45 p-12 text-center shadow-soft backdrop-blur-sm">
        <LogoMark />
        <p className="max-w-xl text-lg text-muted">{content.headline}</p>
        <ActionButton cta={content.cta} />
        <div className="flex flex-wrap justify-center gap-6 pt-4 text-sm font-semibold text-ink/80">
          {content.links.map((link) => (
            <Link key={link} href="#">
              {link}
            </Link>
          ))}
        </div>
      </div>
    </SectionShell>
  );
};
