"use client";

import { motion } from "framer-motion";
import { ActionButton } from "@/components/ui/ActionButton";
import { BadgePill } from "@/components/ui/BadgePill";
import { SectionShell } from "@/components/ui/SectionShell";
import type { LandingPageContent } from "@/content/landing";
import { floatingLoop } from "@/lib/motion";

interface HeroSectionProps {
  content: LandingPageContent["hero"];
}

export const HeroSection = ({ content }: HeroSectionProps) => {
  return (
    <SectionShell id="hero" className="relative flex min-h-[88vh] items-center overflow-hidden pt-24">
      <div className="orb-rings" aria-hidden />

      <motion.div
        className="relative mx-auto w-full max-w-4xl rounded-[44px] border border-white/70 bg-white/40 p-8 text-center shadow-soft backdrop-blur-sm sm:p-12"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.95, ease: [0.2, 0.65, 0.3, 0.95] }}
      >
        <motion.div animate={floatingLoop} className="mb-5 inline-flex">
          <BadgePill text={content.badge} symbol="✦" />
        </motion.div>

        <h1 className="mb-3 text-5xl font-semibold tracking-tight text-ink sm:text-7xl">{content.title}</h1>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-muted">{content.subtitle}</p>

        <div className="mb-10 flex flex-wrap items-center justify-center gap-3">
          {content.ctas.map((cta) => (
            <ActionButton key={cta.label} cta={cta} />
          ))}
        </div>

        <blockquote className="mx-auto max-w-2xl text-balance text-base leading-relaxed text-muted">
          “{content.quote}”
          <footer className="mt-2 text-sm font-semibold text-ink/70">{content.quoteAuthor}</footer>
        </blockquote>
      </motion.div>
    </SectionShell>
  );
};
