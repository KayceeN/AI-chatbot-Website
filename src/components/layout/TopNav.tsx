"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { LandingNavItem } from "@/content/landing";
import { LogoMark } from "@/components/ui/LogoMark";
import { ActionButton } from "@/components/ui/ActionButton";

interface TopNavProps {
  nav: LandingNavItem[];
}

export const TopNav = ({ nav }: TopNavProps) => {
  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.2, 0.65, 0.3, 0.95] }}
      className="sticky top-0 z-40 border-b border-white/60 bg-canvas/70 backdrop-blur-xl"
    >
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4 sm:px-8">
        <Link href="#hero" aria-label="OrbAI home" className="scale-50 origin-left sm:scale-75 lg:scale-100">
          <LogoMark />
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {nav.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                className="text-sm font-semibold text-ink/80 transition-colors duration-300 hover:text-ink"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <ActionButton cta={{ label: "Get Started", href: "#contact", variant: "primary" }} className="px-5 py-2.5 text-sm" />
      </nav>
    </motion.header>
  );
};
