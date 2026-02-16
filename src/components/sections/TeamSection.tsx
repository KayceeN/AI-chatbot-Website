"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Twitter, Instagram, Linkedin, Users } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionShell } from "@/components/ui/SectionShell";
import type { LandingPageContent } from "@/content/landing";

interface TeamSectionProps {
  content: LandingPageContent["team"];
}

const socialIcons = [
  { icon: Twitter, label: "Twitter" },
  { icon: Instagram, label: "Instagram" },
  { icon: Linkedin, label: "LinkedIn" },
];

export const TeamSection = ({ content }: TeamSectionProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const cardWidth = scrollRef.current.firstElementChild?.clientWidth ?? 320;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -cardWidth - 20 : cardWidth + 20,
      behavior: "smooth",
    });
  };

  return (
    <SectionShell id="team">
      <SectionHeading
        badge={content.badge}
        title={content.title}
        subtitle={content.subtitle}
        icon={<Users className="h-3.5 w-3.5" />}
      />

      <div className="relative">
        {/* Carousel navigation — hidden on small screens, visible on md+ */}
        <button
          type="button"
          onClick={() => scroll("left")}
          className="absolute -left-4 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black text-white shadow-button transition-opacity hover:opacity-80 md:flex"
          aria-label="Previous team member"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => scroll("right")}
          className="absolute -right-4 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black text-white shadow-button transition-opacity hover:opacity-80 md:flex"
          aria-label="Next team member"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* Card carousel */}
        <div
          ref={scrollRef}
          className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth"
        >
          {content.members.map((member) => (
            <motion.div
              key={member.name}
              className="w-full min-w-[280px] max-w-[340px] flex-shrink-0 snap-center"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.56 }}
            >
              <GlassCard className="h-full">
                <h3 className="text-xl font-semibold tracking-tight text-ink">{member.name}</h3>
                <p className="mb-3 text-sm text-muted">{member.role}</p>
                <div className="mb-4 flex gap-2">
                  {socialIcons.map(({ icon: Icon, label }) => (
                    <a
                      key={label}
                      href="#"
                      aria-label={`${member.name} ${label}`}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white transition-opacity hover:opacity-80"
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </a>
                  ))}
                </div>
                {/* Photo placeholder */}
                <div className="aspect-square w-full rounded-2xl bg-gradient-to-br from-[#384250] via-[#212733] to-[#191d26]" />
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionShell>
  );
};
