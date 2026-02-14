"use client";

import { useMemo, useState } from "react";
import { ActionButton } from "@/components/ui/ActionButton";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionShell } from "@/components/ui/SectionShell";
import type { LandingPageContent } from "@/content/landing";

interface PricingSectionProps {
  content: LandingPageContent["pricing"];
}

type BillingMode = "monthly" | "yearly";

export const PricingSection = ({ content }: PricingSectionProps) => {
  const [mode, setMode] = useState<BillingMode>("monthly");
  const buttons = useMemo(
    () => [
      { key: "monthly", label: "Monthly" },
      { key: "yearly", label: "Yearly" }
    ],
    []
  );

  return (
    <SectionShell id="pricing">
      <SectionHeading badge={content.badge} title={content.title} subtitle={content.subtitle} />

      <div className="mx-auto mb-8 flex w-fit items-center gap-2 rounded-full border border-white/80 bg-panel p-1 shadow-plate">
        {buttons.map((button) => (
          <button
            key={button.key}
            type="button"
            onClick={() => setMode(button.key as BillingMode)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              mode === button.key ? "bg-white text-ink shadow-plate" : "text-muted"
            }`}
          >
            {button.label}
          </button>
        ))}
        <span className="rounded-full bg-white px-3 py-1 text-sm font-bold text-ink shadow-plate">30% off</span>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {content.plans.map((plan) => (
          <GlassCard key={plan.name} className="relative h-full">
            <div className="mb-5 flex items-center gap-2">
              <h3 className="text-3xl font-semibold tracking-tight text-ink">{plan.name}</h3>
              {plan.popular ? (
                <span className="rounded-full bg-black px-3 py-1 text-xs font-semibold text-white">Popular</span>
              ) : null}
            </div>

            <p className="mb-3 text-5xl font-semibold tracking-tight text-ink">{mode === "monthly" ? plan.monthly : plan.yearly}</p>
            <p className="mb-6 text-lg text-muted">{plan.blurb}</p>

            <ActionButton
              cta={{ label: "Get Started", href: "#contact", variant: plan.popular ? "primary" : "secondary" }}
              className="mb-5 w-full"
            />

            <ul className="space-y-2">
              {plan.features.map((feature) => (
                <li key={feature} className="text-base text-muted">
                  ✓ {feature}
                </li>
              ))}
            </ul>
          </GlassCard>
        ))}
      </div>

      <p className="mx-auto mt-8 w-fit rounded-full border border-white/80 bg-panel px-5 py-2 text-sm font-semibold text-muted shadow-plate">
        {content.donationLine}
      </p>
    </SectionShell>
  );
};
