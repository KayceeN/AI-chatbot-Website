"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionShell } from "@/components/ui/SectionShell";
import type { LandingPageContent } from "@/content/landing";

interface CustomersSectionProps {
  content: LandingPageContent["customers"];
}

export const CustomersSection = ({ content }: CustomersSectionProps) => {
  return (
    <SectionShell id="customers">
      <SectionHeading badge={content.badge} title={content.title} subtitle={content.subtitle} />

      <div className="grid gap-5 lg:grid-cols-2">
        <GlassCard className="flex min-h-[19rem] items-center justify-center p-10 text-center">
          <p className="text-balance text-4xl font-semibold tracking-tight text-ink">{content.featureQuote}</p>
        </GlassCard>
        <GlassCard>
          <div className="h-full min-h-[19rem] rounded-3xl bg-gradient-to-br from-[#384250] via-[#212733] to-[#191d26]" />
        </GlassCard>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        {content.miniTestimonials.map((item) => (
          <GlassCard key={item.name}>
            <p className="mb-5 text-lg text-muted">{item.quote}</p>
            <p className="text-xl font-semibold tracking-tight text-ink">{item.name}</p>
            <p className="text-sm text-muted">{item.role}</p>
          </GlassCard>
        ))}
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {content.stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-white/75 bg-panel px-5 py-4 text-center shadow-plate">
            <p className="text-4xl font-semibold tracking-tight text-ink">{stat.value}</p>
            <p className="text-sm text-muted">{stat.label}</p>
          </div>
        ))}
      </div>
    </SectionShell>
  );
};
