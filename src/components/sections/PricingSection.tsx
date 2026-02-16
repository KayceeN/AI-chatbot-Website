"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, DollarSign } from "lucide-react";
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

  return (
    <SectionShell id="pricing">
      <SectionHeading
        badge={content.badge}
        title={content.title}
        subtitle={content.subtitle}
        icon={<DollarSign className="h-3.5 w-3.5" />}
      />

      <div className="relative mx-auto mb-8 flex w-fit items-center gap-2 rounded-full border border-white/80 bg-panel p-1 shadow-plate">
        {/* Sliding indicator */}
        <motion.div
          className="absolute inset-y-1 rounded-full bg-white shadow-plate"
          layout
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          style={{
            left: mode === "monthly" ? "4px" : "50%",
            right: mode === "yearly" ? "4px" : "50%",
          }}
        />
        <button
          type="button"
          onClick={() => setMode("monthly")}
          className={`relative z-10 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
            mode === "monthly" ? "text-ink" : "text-muted"
          }`}
        >
          Monthly
        </button>
        <button
          type="button"
          onClick={() => setMode("yearly")}
          className={`relative z-10 flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
            mode === "yearly" ? "text-ink" : "text-muted"
          }`}
        >
          Yearly
          <span className={`rounded-full px-2 py-0.5 text-xs font-bold transition-colors ${
            mode === "yearly" ? "bg-ink text-white" : "bg-white text-ink shadow-plate"
          }`}>30% off</span>
        </button>
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
                <li key={feature} className="flex items-center gap-2 text-base text-muted">
                  <Check className="h-4 w-4 flex-shrink-0 text-ink" />
                  {feature}
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
