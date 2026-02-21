"use client";

import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardTopBarProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  userName: string;
}

export function DashboardTopBar({
  sidebarOpen,
  onToggleSidebar,
  userName,
}: DashboardTopBarProps) {
  return (
    <header className="flex items-center justify-between border-b border-white/75 bg-panel/90 px-6 py-4 backdrop-blur-[2px] lg:justify-end">
      {/* Mobile hamburger */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={onToggleSidebar}
        aria-label={sidebarOpen ? "Close menu" : "Open menu"}
      >
        {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* User info */}
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-xs font-bold text-white">
          {userName.charAt(0).toUpperCase()}
        </div>
        <span className="text-sm font-medium text-ink">{userName}</span>
      </div>
    </header>
  );
}
