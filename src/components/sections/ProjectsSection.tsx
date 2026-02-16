"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Grid3x3 } from "lucide-react";
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
      <SectionHeading
        badge={content.badge}
        title={content.title}
        subtitle={content.subtitle}
        icon={<Grid3x3 className="h-3.5 w-3.5" />}
      />

      <GlassCard>
        <div className="relative mb-5 grid gap-2 sm:grid-cols-3">
          {content.tabs.map((tab, index) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`relative rounded-xl border px-4 py-3 text-xs font-semibold tracking-[0.08em] transition-colors ${
                activeIndex === index
                  ? "border-transparent text-white"
                  : "border-white/80 bg-white/80 text-ink shadow-plate"
              }`}
            >
              {activeIndex === index && (
                <motion.div
                  layoutId="project-tab-active"
                  className="absolute inset-0 rounded-xl bg-black shadow-button"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{tab}</span>
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
            <div className="min-h-[14rem] rounded-3xl bg-gradient-to-br from-[#1d212d] via-[#313744] to-[#101319] shadow-soft sm:min-h-[20rem]" />

            <div className="flex flex-col justify-center">
              <p className="mb-2 text-sm font-bold tracking-[0.16em] text-muted">{activeCase.id}</p>
              <h3 className="mb-3 text-2xl font-semibold tracking-tight text-ink sm:text-4xl">{activeCase.title}</h3>
              <p className="mb-6 text-lg text-muted">{activeCase.body}</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {activeCase.metrics.map((metric) => (
                  <div key={metric.label} className="rounded-2xl border border-white/80 bg-white/70 p-5 shadow-plate">
                    <p className="text-3xl font-semibold tracking-tight text-ink sm:text-5xl">{metric.value}</p>
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
