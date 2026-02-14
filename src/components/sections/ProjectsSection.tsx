"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionShell } from "@/components/ui/SectionShell";
import type { LandingPageContent } from "@/content/landing";

interface ProjectsSectionProps {
  content: LandingPageContent["projects"];
}

export const ProjectsSection = ({ content }: ProjectsSectionProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeCase = useMemo(() => content.caseStudies[activeIndex], [activeIndex, content.caseStudies]);

  return (
    <SectionShell id="projects">
      <SectionHeading badge={content.badge} title={content.title} subtitle={content.subtitle} />

      <GlassCard>
        <div className="mb-5 grid gap-2 sm:grid-cols-3">
          {content.tabs.map((tab, index) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`rounded-xl border px-4 py-3 text-xs font-semibold tracking-[0.08em] transition-all ${
                activeIndex === index
                  ? "border-transparent bg-black text-white shadow-button"
                  : "border-white/80 bg-white/80 text-ink shadow-plate"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeCase.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.55 }}
            className="grid gap-6 lg:grid-cols-[1.05fr_1fr]"
          >
            <div className="min-h-[20rem] rounded-3xl bg-gradient-to-br from-[#1d212d] via-[#313744] to-[#101319] shadow-soft" />

            <div className="flex flex-col justify-center">
              <p className="mb-2 text-sm font-bold tracking-[0.16em] text-muted">{activeCase.id}</p>
              <h3 className="mb-3 text-4xl font-semibold tracking-tight text-ink">{activeCase.title}</h3>
              <p className="mb-6 text-lg text-muted">{activeCase.body}</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {activeCase.metrics.map((metric) => (
                  <div key={metric.label} className="rounded-2xl border border-white/80 bg-white/70 p-5 shadow-plate">
                    <p className="text-5xl font-semibold tracking-tight text-ink">{metric.value}</p>
                    <p className="mt-2 text-base text-muted">{metric.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </GlassCard>
    </SectionShell>
  );
};
