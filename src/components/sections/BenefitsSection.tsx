"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionShell } from "@/components/ui/SectionShell";
import type { LandingPageContent } from "@/content/landing";
import { containerStagger, getPreset } from "@/lib/motion";

interface BenefitsSectionProps {
  content: LandingPageContent["benefits"];
}

export const BenefitsSection = ({ content }: BenefitsSectionProps) => {
  // Duplicate chips for seamless marquee loop
  const marqueeChips = [...content.chips, ...content.chips];

  return (
    <SectionShell id="benefits">
      <SectionHeading
        badge={content.badge}
        title={content.title}
        subtitle={content.subtitle}
        icon={<Star className="h-3.5 w-3.5" />}
      />

      <motion.div
        className="grid gap-5 md:grid-cols-3"
        variants={containerStagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.24 }}
      >
        {content.cards.map((item) => (
          <motion.div key={item.title} variants={getPreset("fadeUp") as never} transition={{ duration: 0.72 }}>
            <GlassCard className="h-full">
              <div className="mb-5 h-36 rounded-2xl bg-gradient-to-br from-white to-[#e8e8ea] shadow-inner" />
              <h3 className="mb-2 text-3xl font-semibold tracking-tight text-ink">{item.title}</h3>
              <p className="text-lg text-muted">{item.body}</p>
            </GlassCard>
          </motion.div>
        ))}
      </motion.div>

      {/* Marquee ticker */}
      <div className="mt-8 overflow-hidden">
        <div className="marquee-track flex w-max gap-3">
          {marqueeChips.map((chip, i) => (
            <span
              key={`${chip}-${i}`}
              className="whitespace-nowrap rounded-full border border-white/80 bg-panel px-4 py-2 text-sm font-semibold text-ink/80 shadow-plate"
            >
              {chip}
            </span>
          ))}
        </div>
      </div>
    </SectionShell>
  );
};
