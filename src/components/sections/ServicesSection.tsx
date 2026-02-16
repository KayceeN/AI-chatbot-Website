"use client";

import { motion } from "framer-motion";
import { Settings } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionShell } from "@/components/ui/SectionShell";
import type { LandingPageContent } from "@/content/landing";

interface ServicesSectionProps {
  content: LandingPageContent["services"];
}

export const ServicesSection = ({ content }: ServicesSectionProps) => {
  return (
    <SectionShell id="services">
      <SectionHeading badge={content.badge} title={content.title} subtitle={content.subtitle} icon={<Settings className="h-3.5 w-3.5" />} />

      <div className="grid gap-5 md:grid-cols-2">
        {content.cards.map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.28 }}
            transition={{ duration: 0.66, delay: index * 0.06 }}
          >
            <GlassCard className="h-full">
              <div className="mb-5 h-20 rounded-2xl border border-white/70 bg-gradient-to-b from-white to-[#ececef] shadow-inner" />
              <h3 className="mb-2 text-3xl font-semibold tracking-tight text-ink">{item.title}</h3>
              <p className="text-lg text-muted">{item.body}</p>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </SectionShell>
  );
};
