import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";

// Mock next/navigation
let mockPathname = "/dashboard";
vi.mock("next/navigation", () => ({
  usePathname: () => mockPathname,
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));

// Mock motion/react to avoid animation complexity in tests
vi.mock("motion/react", () => ({
  motion: {
    div: ({ children, className, layoutId, ...props }: React.HTMLAttributes<HTMLDivElement> & { layoutId?: string }) => (
      <div className={className} {...props}>
        {children}
      </div>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock Supabase client
vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    auth: { signOut: vi.fn() },
  }),
}));

import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";

describe("DashboardSidebar", () => {
  test("renders all nav items", () => {
    render(<DashboardSidebar />);

    expect(screen.getByText("Overview")).toBeInTheDocument();
    expect(screen.getByText("Chat")).toBeInTheDocument();
    expect(screen.getByText("Workflows")).toBeInTheDocument();
    expect(screen.getByText("Analytics")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
  });

  test("renders logout button", () => {
    render(<DashboardSidebar />);

    expect(screen.getByText("Log out")).toBeInTheDocument();
  });

  test("nav items have correct hrefs", () => {
    render(<DashboardSidebar />);

    expect(screen.getByText("Overview").closest("a")).toHaveAttribute(
      "href",
      "/dashboard"
    );
    expect(screen.getByText("Chat").closest("a")).toHaveAttribute(
      "href",
      "/dashboard/chat"
    );
    expect(screen.getByText("Settings").closest("a")).toHaveAttribute(
      "href",
      "/dashboard/settings"
    );
  });
});
