"use client";

import { useState } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionShell } from "@/components/ui/SectionShell";
import type { LandingPageContent } from "@/content/landing";

interface FAQSectionProps {
  content: LandingPageContent["faq"];
}

export const FAQSection = ({ content }: FAQSectionProps) => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <SectionShell id="faq">
      <SectionHeading badge={content.badge} title={content.title} subtitle={content.subtitle} />

      <div className="mx-auto grid w-full max-w-3xl gap-3">
        {content.entries.map((item, index) => {
          const open = openIndex === index;
          return (
            <article key={item.question} className="rounded-2xl border border-white/80 bg-panel shadow-plate">
              <button
                type="button"
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-lg font-semibold text-ink"
                onClick={() => setOpenIndex(open ? -1 : index)}
                aria-expanded={open}
                aria-controls={`faq-panel-${index}`}
              >
                <span>{item.question}</span>
                <span className="text-muted">{open ? "−" : "+"}</span>
              </button>
              {open ? (
                <p id={`faq-panel-${index}`} className="px-5 pb-5 text-base text-muted">
                  {item.answer}
                </p>
              ) : null}
            </article>
          );
        })}
      </div>

      <p className="mt-8 text-center text-lg text-muted">
        {content.emailLine} <a className="font-semibold text-ink underline" href={`mailto:${content.email}`}>{content.email}</a>
      </p>
    </SectionShell>
  );
};
