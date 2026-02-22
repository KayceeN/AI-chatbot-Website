import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ChatManagementTabs } from "./chat-tabs";

export default async function ChatPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch conversations with message counts
  const { data: conversations } = await supabase
    .from("conversations")
    .select("id, title, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  // Get message counts per conversation
  const convWithCounts = await Promise.all(
    (conversations ?? []).map(async (conv) => {
      const { count } = await supabase
        .from("messages")
        .select("*", { count: "exact", head: true })
        .eq("conversation_id", conv.id);
      return { ...conv, message_count: count ?? 0 };
    })
  );

  // Fetch knowledge base entries
  const { data: kbEntries } = await supabase
    .from("knowledge_base")
    .select("id, title, content, created_at")
    .eq("user_id", user.id)
    .eq("type", "text")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold text-ink">Chatbot Management</h1>
      <ChatManagementTabs
        conversations={convWithCounts}
        kbEntries={kbEntries ?? []}
      />
    </div>
  );
}
