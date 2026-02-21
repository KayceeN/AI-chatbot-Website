import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { GlassCard } from "@/components/ui/GlassCard";
import { SettingsForm } from "./settings-form";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, avatar_url, plan")
    .eq("id", user.id)
    .single();

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold text-ink">Settings</h1>

      {/* Profile */}
      <GlassCard className="mb-6">
        <h2 className="mb-4 text-lg font-semibold text-ink">Profile</h2>
        <p className="mb-4 text-sm text-muted">Email: {user.email}</p>
        <SettingsForm
          userId={user.id}
          defaultValues={{
            fullName: profile?.full_name ?? "",
            avatarUrl: profile?.avatar_url ?? "",
          }}
        />
      </GlassCard>

      {/* Account */}
      <GlassCard>
        <h2 className="mb-4 text-lg font-semibold text-ink">Account</h2>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted">Current plan:</span>
          <span className="rounded-full bg-ink/5 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-ink">
            {profile?.plan ?? "free"}
          </span>
        </div>
      </GlassCard>
    </div>
  );
}
