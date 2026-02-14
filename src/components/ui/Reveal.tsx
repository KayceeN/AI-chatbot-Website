"use client";

import { motion } from "framer-motion";
import type { PropsWithChildren } from "react";
import type { SectionMotionConfig } from "@/lib/motion";
import { getPreset, getTransition } from "@/lib/motion";

interface RevealProps extends PropsWithChildren {
  className?: string;
  config?: SectionMotionConfig;
}

export const Reveal = ({ className = "", config, children }: RevealProps) => {
  const variants = getPreset(config?.preset ?? "fadeUp");

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: config?.once ?? true, amount: config?.amount ?? 0.22 }}
      variants={variants}
      transition={getTransition(config?.duration ?? 0.72, config?.delay ?? 0)}
    >
      {children}
    </motion.div>
  );
};
