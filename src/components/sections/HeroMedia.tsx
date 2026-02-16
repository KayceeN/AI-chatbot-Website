"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import type { HeroMediaConfig } from "@/content/landing";

interface HeroMediaProps {
  media: HeroMediaConfig;
}

type HeroMediaState = "poster" | "loading" | "ready" | "error" | "reduced";

type IdleCallbackHandle = number;

type IdleWindow = Window & {
  requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => IdleCallbackHandle;
  cancelIdleCallback?: (id: IdleCallbackHandle) => void;
};

export const HeroMedia = ({ media }: HeroMediaProps) => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [isInteractive, setIsInteractive] = useState(false);
  const [isIdle, setIsIdle] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [hasVideoError, setHasVideoError] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setIsReducedMotion(mediaQuery.matches);

    sync();
    mediaQuery.addEventListener("change", sync);
    return () => mediaQuery.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setIsInteractive(true);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (isReducedMotion) {
      return;
    }

    const idleWindow = window as IdleWindow;

    if (typeof idleWindow.requestIdleCallback === "function") {
      const idleHandle = idleWindow.requestIdleCallback(() => {
        setIsIdle(true);
      }, { timeout: media.idleDelayMs });

      return () => {
        if (typeof idleWindow.cancelIdleCallback === "function") {
          idleWindow.cancelIdleCallback(idleHandle);
        }
      };
    }

    const timeoutId = window.setTimeout(() => {
      setIsIdle(true);
    }, media.idleDelayMs);

    return () => window.clearTimeout(timeoutId);
  }, [isReducedMotion, media.idleDelayMs]);

  useEffect(() => {
    if (isReducedMotion || !rootRef.current) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        root: null,
        rootMargin: media.observerRootMargin,
        threshold: media.observerThreshold
      }
    );

    observer.observe(rootRef.current);
    return () => observer.disconnect();
  }, [isReducedMotion, media.observerRootMargin, media.observerThreshold]);

  const shouldLoadVideo = !isReducedMotion && (isInteractive || isIdle || isInView);

  useEffect(() => {
    if (shouldLoadVideo && videoRef.current && typeof videoRef.current.load === "function") {
      try {
        videoRef.current.load();
      } catch {
        // jsdom doesn't implement HTMLMediaElement.load; browsers do.
      }
    }
  }, [shouldLoadVideo]);

  const currentState = useMemo<HeroMediaState>(() => {
    if (isReducedMotion) {
      return "reduced";
    }

    if (hasVideoError) {
      return "error";
    }

    if (isVideoReady) {
      return "ready";
    }

    if (shouldLoadVideo) {
      return "loading";
    }

    return "poster";
  }, [hasVideoError, isReducedMotion, isVideoReady, shouldLoadVideo]);

  return (
    <div
      ref={rootRef}
      data-testid="hero-media"
      data-video-state={currentState}
      data-video-ready={String(isVideoReady)}
      data-video-load-triggered={String(shouldLoadVideo)}
      className="absolute inset-0"
      style={{
        ["--hero-fade-ms" as string]: `${media.fadeMs}ms`
      }}
    >
      <Image
        data-testid="hero-poster"
        src={media.posterSrc}
        alt=""
        aria-hidden
        fill
        priority
        sizes="(max-width: 768px) 100vw, 1152px"
        className={`hero-poster-layer ${isVideoReady ? "is-hidden" : ""}`}
      />

      <video
        ref={videoRef}
        data-testid="hero-video"
        className={`hero-video-layer ${isVideoReady ? "is-visible" : ""}`}
        muted
        loop
        playsInline
        autoPlay={shouldLoadVideo && !isReducedMotion}
        preload={shouldLoadVideo ? "auto" : "none"}
        poster={media.posterSrc}
        aria-hidden
        onCanPlay={() => setIsVideoReady(true)}
        onLoadedData={() => setIsVideoReady(true)}
        onError={() => {
          setHasVideoError(true);
          setIsVideoReady(false);
        }}
      >
        {shouldLoadVideo ? <source src={media.mp4Src} type="video/mp4" /> : null}
        {shouldLoadVideo ? <source src={media.webmSrc} type="video/webm" /> : null}
      </video>
    </div>
  );
};
