"use client";

import { motion } from "framer-motion";
import { Layers } from "lucide-react";
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
      <SectionHeading
        badge={content.badge}
        title={content.title}
        subtitle={content.subtitle}
        icon={<Layers className="h-3.5 w-3.5" />}
      />

      <div className="grid gap-5 lg:grid-cols-2">
        {content.steps.slice(0, 2).map((step, index) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.56, delay: index * 0.08 }}
          >
            <GlassCard className="relative h-full overflow-hidden">
              {/* Decorative step number */}
              <span className="pointer-events-none absolute right-4 top-2 text-[3rem] font-bold leading-none text-ink/[0.04] sm:text-[5rem]">
                {step.id}
              </span>
              <div className="relative">
                <p className="mb-2 text-sm font-bold tracking-[0.16em] text-muted">{step.id}</p>
                <h3 className="mb-1 text-2xl font-semibold tracking-tight text-ink">{step.title}</h3>
                <p className="mb-5 text-base text-muted">{step.body}</p>
              </div>
              {/* Photo placeholder */}
              <div className="h-48 rounded-2xl bg-gradient-to-br from-[#111318] via-[#1a1d26] to-[#2a2f39]" />
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Third step — full width */}
      {content.steps[2] && (
        <motion.div
          className="mt-5"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.56, delay: 0.16 }}
        >
          <GlassCard className="relative overflow-hidden">
            <span className="pointer-events-none absolute right-4 top-2 text-[3rem] font-bold leading-none text-ink/[0.04] sm:text-[5rem]">
              {content.steps[2].id}
            </span>
            <div className="grid gap-5 lg:grid-cols-[1fr_1.2fr]">
              <div className="relative">
                <p className="mb-2 text-sm font-bold tracking-[0.16em] text-muted">{content.steps[2].id}</p>
                <h3 className="mb-1 text-2xl font-semibold tracking-tight text-ink">{content.steps[2].title}</h3>
                <p className="text-base text-muted">{content.steps[2].body}</p>
              </div>
              <div className="h-48 rounded-2xl bg-gradient-to-br from-[#111318] via-[#1a1d26] to-[#2a2f39]" />
            </div>
          </GlassCard>
        </motion.div>
      )}
    </SectionShell>
  );
};
