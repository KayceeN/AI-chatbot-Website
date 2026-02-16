"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { ActionButton } from "@/components/ui/ActionButton";
import { BadgePill } from "@/components/ui/BadgePill";
import { SectionShell } from "@/components/ui/SectionShell";
import type { LandingPageContent } from "@/content/landing";
import { floatingLoop } from "@/lib/motion";
import { HeroMedia } from "@/components/sections/HeroMedia";

interface HeroSectionProps {
  content: LandingPageContent["hero"];
}

export const HeroSection = ({ content }: HeroSectionProps) => {
  const titleChars = content.title.split("");

  return (
    <SectionShell
      id="hero"
      className="relative flex min-h-screen max-w-none items-center overflow-hidden bg-white px-0 py-0 pt-20 sm:px-0 sm:pt-24"
    >
      <motion.div
        className="hero-media-shell relative mx-auto w-full max-w-none"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.95, ease: [0.2, 0.65, 0.3, 0.95] }}
        style={{ ["--hero-aspect-ratio" as string]: content.media.aspectRatio }}
      >
        <HeroMedia media={content.media} />
        <div className="hero-media-overlay" aria-hidden />

        <div className="hero-content-layer">
          <div className="hero-content-card p-6 text-center sm:p-10 md:text-left">
            <motion.div animate={floatingLoop} className="mb-5 inline-flex">
              <BadgePill text={content.badge} icon={<Sparkles className="h-3.5 w-3.5" />} />
            </motion.div>

            <h1 className="mb-3 text-5xl font-semibold tracking-tight text-ink sm:text-7xl md:text-8xl" aria-label={content.title}>
              {titleChars.map((char, index) => {
                const accentClass = char === "A" ? "brand-letter-a" : char === "I" ? "brand-letter-i" : "";
                return (
                  <span key={`${char}-${index}`} className={accentClass || undefined}>
                    {char}
                  </span>
                );
              })}
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted md:mx-0">{content.subtitle}</p>

            <div className="mb-10 flex flex-wrap items-center justify-center gap-3 md:justify-start">
              {content.ctas.map((cta) => (
                <ActionButton key={cta.label} cta={cta} />
              ))}
            </div>

            <blockquote className="mx-auto max-w-2xl text-balance text-base leading-relaxed text-muted md:mx-0">
              “{content.quote}”
              <footer className="mt-2 text-sm font-semibold text-ink/70">{content.quoteAuthor}</footer>
            </blockquote>
          </div>
        </div>
      </motion.div>
    </SectionShell>
  );
};
