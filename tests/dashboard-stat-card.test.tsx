import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { MessageSquare } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";

describe("StatCard", () => {
  test("renders label and value", () => {
    render(<StatCard label="Total Conversations" value={42} icon={MessageSquare} />);
    expect(screen.getByText("Total Conversations")).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();
  });

  test("renders zero value", () => {
    render(<StatCard label="Active Workflows" value={0} icon={MessageSquare} />);
    expect(screen.getByText("0")).toBeInTheDocument();
  });
});
