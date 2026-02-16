"use client";

import { motion } from "framer-motion";
import { Check, Scale } from "lucide-react";
import { ActionButton } from "@/components/ui/ActionButton";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionShell } from "@/components/ui/SectionShell";
import type { LandingPageContent } from "@/content/landing";
import { containerStagger, getPreset } from "@/lib/motion";

interface ComparisonSectionProps {
  content: LandingPageContent["comparison"];
}

export const ComparisonSection = ({ content }: ComparisonSectionProps) => {
  return (
    <SectionShell id="comparison">
      <SectionHeading
        badge={content.badge}
        title={content.title}
        subtitle={content.subtitle}
        icon={<Scale className="h-3.5 w-3.5" />}
      />

      <motion.div
        className="grid gap-5 lg:grid-cols-2"
        variants={containerStagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.22 }}
      >
        {/* kAyphI column */}
        <motion.div variants={getPreset("fadeUp") as never} transition={{ duration: 0.7 }}>
          <GlassCard className="flex h-full flex-col">
            <h3 className="mb-6 text-3xl font-semibold tracking-tight text-ink">{content.us.label}</h3>
            <ul className="mb-6 flex-1 space-y-3">
              {content.us.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-base text-muted">
                  <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-ink" />
                  {feature}
                </li>
              ))}
            </ul>
            <ActionButton cta={{ label: "Get Started", href: "#contact", variant: "primary" }} className="w-full" />
          </GlassCard>
        </motion.div>

        {/* Others column */}
        <motion.div variants={getPreset("fadeUp") as never} transition={{ duration: 0.7 }}>
          <GlassCard className="flex h-full flex-col">
            <h3 className="mb-6 text-3xl font-semibold tracking-tight text-ink">{content.others.label}</h3>
            <ul className="flex-1 space-y-3">
              {content.others.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-base text-muted">
                  <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted" />
                  {feature}
                </li>
              ))}
            </ul>
          </GlassCard>
        </motion.div>
      </motion.div>
    </SectionShell>
  );
};
