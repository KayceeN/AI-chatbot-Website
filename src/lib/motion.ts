import type { Variants } from "framer-motion";

export type MotionPreset = "fadeUp" | "fadeIn" | "scaleIn" | "slideLeft" | "slideRight";

export interface SectionMotionConfig {
  preset: MotionPreset;
  amount?: number;
  once?: boolean;
  delay?: number;
  duration?: number;
}

const baseEase = [0.2, 0.65, 0.3, 0.95] as const;

const presetVariants: Record<MotionPreset, Variants> = {
  fadeUp: {
    hidden: { opacity: 0, y: 28 },
    visible: { opacity: 1, y: 0 }
  },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.94 },
    visible: { opacity: 1, scale: 1 }
  },
  slideLeft: {
    hidden: { opacity: 0, x: 24 },
    visible: { opacity: 1, x: 0 }
  },
  slideRight: {
    hidden: { opacity: 0, x: -24 },
    visible: { opacity: 1, x: 0 }
  }
};

export const getPreset = (preset: MotionPreset): Variants => presetVariants[preset];

export const getTransition = (duration = 0.72, delay = 0) => ({
  duration,
  delay,
  ease: baseEase
});

export const containerStagger: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.08
    }
  }
};

export const floatingLoop = {
  y: [-5, 6, -5],
  transition: {
    duration: 8,
    repeat: Infinity,
    ease: "easeInOut" as const
  }
};
