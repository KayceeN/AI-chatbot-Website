"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import type { LandingNavItem } from "@/content/landing";
import { LogoMark } from "@/components/ui/LogoMark";
import { ActionButton } from "@/components/ui/ActionButton";

interface TopNavProps {
  nav: LandingNavItem[];
}

export const TopNav = ({ nav }: TopNavProps) => {
  const { scrollY } = useScroll();
  const lastScrollY = useRef(0);
  const [hidden, setHidden] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const diff = latest - lastScrollY.current;
    if (latest < 80) {
      setHidden(false);
    } else if (diff > 5) {
      setHidden(true);
    } else if (diff < -5) {
      setHidden(false);
    }
    lastScrollY.current = latest;
  });

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: hidden ? "-100%" : 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: [0.2, 0.65, 0.3, 0.95] }}
      className="sticky top-0 z-40 border-b border-black/5 bg-white"
    >
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4 sm:px-8">
        <Link href="#hero" aria-label="kAyphI home" className="scale-[0.65] origin-left sm:scale-75 lg:scale-100">
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

        <ActionButton cta={{ label: "Get Started", href: "#contact", variant: "primary" }} className="min-h-[44px] px-5 py-2.5 text-sm" />
      </nav>
    </motion.header>
  );
};
