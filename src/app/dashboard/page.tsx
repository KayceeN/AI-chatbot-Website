import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "./logout-button";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const fullName = user.user_metadata?.full_name ?? "User";

  return (
    <div>
      <h1 className="mb-2 text-3xl font-bold text-ink">
        Welcome, {fullName}
      </h1>
      <p className="mb-8 text-muted">{user.email}</p>
      <LogoutButton />
    </div>
  );
}
