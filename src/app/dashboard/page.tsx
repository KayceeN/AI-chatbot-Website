import { redirect } from "next/navigation";
import Link from "next/link";
import {
  MessageSquare,
  BookOpen,
  Workflow,
  CalendarDays,
  Settings,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { GlassCard } from "@/components/ui/GlassCard";
import { StatCard } from "@/components/dashboard/StatCard";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const fullName = user.user_metadata?.full_name ?? "User";

  // Fetch stats — explicit user_id filter as belt-and-suspenders with RLS.
  // Errors are treated as 0 (empty state) since tables may have no data yet.
  const userId = user.id;
  const [conversations, knowledgeBase, workflows, bookings] = await Promise.all(
    [
      supabase
        .from("conversations")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .then((r) => r.count ?? 0),
      supabase
        .from("knowledge_base")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .then((r) => r.count ?? 0),
      supabase
        .from("workflows")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("is_active", true)
        .then((r) => r.count ?? 0),
      supabase
        .from("bookings")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .gte("date", new Date().toISOString().split("T")[0])
        .then((r) => r.count ?? 0),
    ]
  );

  return (
    <div>
      <h1 className="mb-1 text-3xl font-bold text-ink">
        Welcome back, {fullName}
      </h1>
      <p className="mb-8 text-muted">{user.email}</p>

      {/* Stat cards */}
      <div className="mb-10 grid gap-4 sm:grid-cols-2">
        <StatCard
          label="Total Conversations"
          value={conversations}
          icon={MessageSquare}
        />
        <StatCard
          label="Knowledge Base Entries"
          value={knowledgeBase}
          icon={BookOpen}
        />
        <StatCard
          label="Active Workflows"
          value={workflows}
          icon={Workflow}
        />
        <StatCard
          label="Upcoming Bookings"
          value={bookings}
          icon={CalendarDays}
        />
      </div>

      {/* Quick actions */}
      <h2 className="mb-4 text-lg font-semibold text-ink">Quick actions</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        <Link href="/dashboard/chat">
          <GlassCard className="transition-shadow hover:shadow-plate">
            <MessageSquare className="mb-3 h-6 w-6 text-ink" />
            <h3 className="mb-1 font-semibold text-ink">Chatbot</h3>
            <p className="text-sm text-muted">
              Configure your AI chatbot and manage knowledge base
            </p>
          </GlassCard>
        </Link>
        <Link href="/dashboard/workflows">
          <GlassCard className="transition-shadow hover:shadow-plate">
            <Workflow className="mb-3 h-6 w-6 text-ink" />
            <h3 className="mb-1 font-semibold text-ink">Workflows</h3>
            <p className="text-sm text-muted">
              Build and manage automated workflows
            </p>
          </GlassCard>
        </Link>
        <Link href="/dashboard/settings">
          <GlassCard className="transition-shadow hover:shadow-plate">
            <Settings className="mb-3 h-6 w-6 text-ink" />
            <h3 className="mb-1 font-semibold text-ink">Settings</h3>
            <p className="text-sm text-muted">
              Update your profile and account preferences
            </p>
          </GlassCard>
        </Link>
      </div>
    </div>
  );
}
