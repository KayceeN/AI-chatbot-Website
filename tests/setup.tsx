import "@testing-library/jest-dom/vitest";
import React from "react";
import { vi } from "vitest";

class MockIntersectionObserver {
  static instances: MockIntersectionObserver[] = [];
  callback: IntersectionObserverCallback;

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
    MockIntersectionObserver.instances.push(this);
  }

  observe() {}
  unobserve() {}
  disconnect() {}

  trigger(isIntersecting: boolean) {
    this.callback([{ isIntersecting } as IntersectionObserverEntry], this as unknown as IntersectionObserver);
  }
}

Object.defineProperty(globalThis, "IntersectionObserver", {
  writable: true,
  configurable: true,
  value: MockIntersectionObserver
});

Object.defineProperty(globalThis, "matchMedia", {
  writable: true,
  configurable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn()
  }))
});

Object.defineProperty(globalThis, "requestIdleCallback", {
  writable: true,
  configurable: true,
  value: (cb: () => void) => window.setTimeout(cb, 0)
});

Object.defineProperty(globalThis, "cancelIdleCallback", {
  writable: true,
  configurable: true,
  value: (id: number) => window.clearTimeout(id)
});

Object.defineProperty(HTMLMediaElement.prototype, "load", {
  writable: true,
  configurable: true,
  value: vi.fn()
});

vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...props}>
      {children}
    </a>
  )
}));

vi.mock("next/font/google", () => ({
  Manrope: () => ({
    className: "",
    variable: "--font-manrope"
  })
}));
