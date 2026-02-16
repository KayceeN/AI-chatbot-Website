"use client";

import { MessageCircle, Star } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionShell } from "@/components/ui/SectionShell";
import type { LandingPageContent } from "@/content/landing";

interface CustomersSectionProps {
  content: LandingPageContent["customers"];
}

const StarRating = () => (
  <div className="mb-3 flex gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} className="h-4 w-4 fill-ink text-ink" />
    ))}
  </div>
);

const Avatar = ({ name }: { name: string }) => {
  const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2);
  return (
    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#384250] to-[#191d26] text-sm font-semibold text-white">
      {initials}
    </div>
  );
};

export const CustomersSection = ({ content }: CustomersSectionProps) => {
  return (
    <SectionShell id="customers">
      <SectionHeading
        badge={content.badge}
        title={content.title}
        subtitle={content.subtitle}
        icon={<MessageCircle className="h-3.5 w-3.5" />}
      />

      <div className="grid gap-5 lg:grid-cols-2">
        <GlassCard className="flex min-h-[19rem] items-center justify-center p-10 text-center">
          <p className="text-balance text-2xl font-semibold tracking-tight text-ink sm:text-4xl">{content.featureQuote}</p>
        </GlassCard>
        <GlassCard>
          <div className="h-full min-h-[19rem] rounded-3xl bg-gradient-to-br from-[#384250] via-[#212733] to-[#191d26]" />
        </GlassCard>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        {content.miniTestimonials.map((item) => (
          <GlassCard key={item.name}>
            <StarRating />
            <p className="mb-5 text-lg text-muted">{item.quote}</p>
            <div className="flex items-center gap-3">
              <Avatar name={item.name} />
              <div>
                <p className="text-xl font-semibold tracking-tight text-ink">{item.name}</p>
                <p className="text-sm text-muted">{item.role}</p>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {content.stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-white/75 bg-panel px-5 py-4 text-center shadow-plate">
            <p className="text-2xl font-semibold tracking-tight text-ink sm:text-4xl">{stat.value}</p>
            <p className="text-sm text-muted">{stat.label}</p>
          </div>
        ))}
      </div>
    </SectionShell>
  );
};
