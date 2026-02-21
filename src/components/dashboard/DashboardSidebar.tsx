"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
  LayoutDashboard,
  MessageSquare,
  Workflow,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Chat", href: "/dashboard/chat", icon: MessageSquare },
  { label: "Workflows", href: "/dashboard/workflows", icon: Workflow },
  { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

interface DashboardSidebarProps {
  onNavigate?: () => void;
}

export function DashboardSidebar({ onNavigate }: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  function isActive(href: string) {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  }

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <nav className="flex h-full flex-col bg-ink px-3 py-6">
      {/* Logo */}
      <Link
        href="/dashboard"
        className="mb-8 flex items-center gap-2 px-3"
        onClick={onNavigate}
      >
        <span className="relative inline-flex h-6 w-6 items-center justify-center rounded-full bg-white">
          <span className="absolute h-2.5 w-2.5 -translate-x-[5px] rotate-45 rounded-sm bg-ink" />
          <span className="absolute h-2.5 w-2.5 translate-x-[5px] rotate-45 rounded-sm bg-ink" />
        </span>
        <span className="text-lg font-semibold tracking-tight text-white">
          <span>k</span>
          <span className="brand-letter-a">A</span>
          <span>yph</span>
          <span className="brand-letter-i">I</span>
        </span>
      </Link>

      {/* Nav items */}
      <ul className="flex flex-1 flex-col gap-1">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <li key={item.href} className="relative">
              {active && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-lg bg-white/10"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              <Link
                href={item.href}
                onClick={onNavigate}
                className={`relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  active ? "text-white" : "text-white/60 hover:text-white/80"
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/60 transition-colors hover:text-white/80"
      >
        <LogOut className="h-5 w-5" />
        Log out
      </button>
    </nav>
  );
}
