import Link from "next/link";
import { Twitter, Instagram, Linkedin } from "lucide-react";
import { ActionButton } from "@/components/ui/ActionButton";
import { LogoMark } from "@/components/ui/LogoMark";
import { SectionShell } from "@/components/ui/SectionShell";
import type { LandingPageContent } from "@/content/landing";

interface FooterSectionProps {
  content: LandingPageContent["footer"];
}

const socialLinks = [
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
];

export const FooterSection = ({ content }: FooterSectionProps) => {
  return (
    <SectionShell id="footer" className="relative min-h-[50vh] overflow-hidden pb-16 sm:min-h-[70vh] sm:pb-24">
      <div className="orb-rings" aria-hidden />
      <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-6 rounded-3xl border border-white/70 bg-white/45 p-6 text-center shadow-soft backdrop-blur-sm sm:rounded-[42px] sm:p-12">
        <div className="flex gap-4">
          {socialLinks.map(({ icon: Icon, href, label }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/70 bg-panel text-ink/70 shadow-plate transition-colors hover:text-ink"
            >
              <Icon className="h-4 w-4" />
            </a>
          ))}
        </div>

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
        <p className="text-xs text-muted/70">kAyphI &copy; 2025. Designed by FrameBase</p>
      </div>
    </SectionShell>
  );
};
