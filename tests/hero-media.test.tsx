import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { HeroMedia } from "@/components/sections/HeroMedia";
import type { HeroMediaConfig } from "@/content/landing";

const mediaConfig: HeroMediaConfig = {
  posterSrc: "/videos/hero/hero-poster.webp",
  webmSrc: "/videos/hero/hero.webm",
  mp4Src: "/videos/hero/hero.mp4",
  aspectRatio: "16 / 9",
  idleDelayMs: 1200,
  observerRootMargin: "200px 0px",
  observerThreshold: 0.2,
  fadeMs: 520
};

const defaultMatchMedia = globalThis.matchMedia;

const setMatchMedia = (matcher: (query: string) => boolean) => {
  Object.defineProperty(globalThis, "matchMedia", {
    writable: true,
    configurable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: matcher(query),
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn()
    }))
  });
};

describe("HeroMedia", () => {
  beforeEach(() => {
    setMatchMedia(() => false);
  });

  afterEach(() => {
    Object.defineProperty(globalThis, "matchMedia", {
      writable: true,
      configurable: true,
      value: defaultMatchMedia
    });
  });

  test("renders poster first and delays video source attachment", async () => {
    render(<HeroMedia media={mediaConfig} />);

    const mediaRoot = screen.getByTestId("hero-media");
    const poster = screen.getByTestId("hero-poster");
    const video = screen.getByTestId("hero-video") as HTMLVideoElement;

    expect(mediaRoot).toHaveAttribute("data-video-state", "poster");
    expect(poster).toBeInTheDocument();
    expect(video.querySelectorAll("source")).toHaveLength(0);
    expect(video).toHaveAttribute("preload", "none");

    await waitFor(() => {
      expect(video.querySelectorAll("source")).toHaveLength(2);
    });

    expect(["metadata", "auto"]).toContain(video.getAttribute("preload"));
  });

  test("crossfades poster to video when first frame is ready", async () => {
    render(<HeroMedia media={mediaConfig} />);

    const mediaRoot = screen.getByTestId("hero-media");
    const poster = screen.getByTestId("hero-poster");
    const video = screen.getByTestId("hero-video");

    await waitFor(() => {
      expect(video.querySelectorAll("source")).toHaveLength(2);
    });

    fireEvent(video, new Event("loadeddata"));

    await waitFor(() => {
      expect(mediaRoot).toHaveAttribute("data-video-ready", "true");
    });

    expect(video.className).toContain("is-visible");
    expect(poster.className).toContain("is-hidden");
  });

  test("respects reduced motion by keeping poster and disabling autoplay", async () => {
    setMatchMedia((query) => query.includes("prefers-reduced-motion"));

    render(<HeroMedia media={mediaConfig} />);

    const mediaRoot = screen.getByTestId("hero-media");
    const video = screen.getByTestId("hero-video") as HTMLVideoElement;

    expect(mediaRoot).toHaveAttribute("data-video-state", "reduced");
    expect(video.querySelectorAll("source")).toHaveLength(0);
    expect(video.autoplay).toBe(false);
  });
});
