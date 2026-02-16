"use client";

import { motion } from "framer-motion";
import { Settings } from "lucide-react";
import { ActionButton } from "@/components/ui/ActionButton";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionShell } from "@/components/ui/SectionShell";
import type { LandingPageContent } from "@/content/landing";
import { containerStagger, getPreset } from "@/lib/motion";

interface FeaturesSectionProps {
  content: LandingPageContent["features"];
}

const visualClass: Record<LandingPageContent["features"]["cards"][number]["visual"], string> = {
  topLeft: "from-[#dde7ef] via-[#f2f4f7] to-[#cfd9e2]",
  topRight: "from-[#dce4d8] via-[#f0f2eb] to-[#dae0d0]",
  bottomLeft: "from-[#e5ddcf] via-[#f4f0e8] to-[#d9cfbe]",
  bottomRight: "from-[#d4dbe5] via-[#f0f3f7] to-[#c8d2de]"
};

export const FeaturesSection = ({ content }: FeaturesSectionProps) => {
  return (
    <SectionShell id="features">
      <SectionHeading badge={content.badge} title={content.title} subtitle={content.subtitle} icon={<Settings className="h-3.5 w-3.5" />} />

      <motion.div
        className="grid gap-5 md:grid-cols-2"
        variants={containerStagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.22 }}
      >
        {content.cards.map((item) => (
          <motion.div key={item.title} variants={getPreset("fadeUp") as never} transition={{ duration: 0.7 }}>
            <GlassCard className="h-full">
              <div className={`mb-5 h-40 rounded-2xl bg-gradient-to-br ${visualClass[item.visual]} shadow-inner`} />
              <h3 className="mb-2 text-3xl font-semibold text-ink">{item.title}</h3>
              <p className="text-lg text-muted">{item.body}</p>
            </GlassCard>
          </motion.div>
        ))}
      </motion.div>

      <div className="mt-10 flex flex-wrap justify-center gap-3">
        {content.ctas.map((cta) => (
          <ActionButton key={cta.label} cta={cta} />
        ))}
      </div>
    </SectionShell>
  );
};
