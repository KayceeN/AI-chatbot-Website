"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionShell } from "@/components/ui/SectionShell";
import type { LandingPageContent } from "@/content/landing";

interface ProcessSectionProps {
  content: LandingPageContent["process"];
}

export const ProcessSection = ({ content }: ProcessSectionProps) => {
  return (
    <SectionShell id="process">
      <SectionHeading badge={content.badge} title={content.title} subtitle={content.subtitle} />

      <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr]">
        <GlassCard>
          <div className="grid gap-4">
            {content.steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.56, delay: index * 0.08 }}
                className="rounded-2xl border border-white/75 bg-white/70 p-5"
              >
                <p className="mb-2 text-sm font-bold tracking-[0.16em] text-muted">{step.id}</p>
                <h3 className="mb-1 text-2xl font-semibold tracking-tight text-ink">{step.title}</h3>
                <p className="text-base text-muted">{step.body}</p>
              </motion.div>
            ))}
          </div>
        </GlassCard>

        <GlassCard>
          <div className="h-full rounded-3xl bg-gradient-to-br from-[#111318] via-[#1a1d26] to-[#2a2f39] p-6 text-white">
            <p className="mb-6 text-sm font-semibold uppercase tracking-[0.15em] text-white/70">Automation Preview</p>
            <div className="space-y-3">
              <div className="h-12 rounded-xl bg-white/10" />
              <div className="h-12 rounded-xl bg-white/10" />
              <div className="h-12 rounded-xl bg-white/10" />
              <div className="h-12 rounded-xl bg-white/10" />
            </div>
          </div>
        </GlassCard>
      </div>
    </SectionShell>
  );
};
