"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { ChatBubble } from "@/components/chat/ChatBubble";
import { GlassCard } from "@/components/ui/GlassCard";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

interface ConversationDetailProps {
  conversationId: string;
}

export function ConversationDetail({ conversationId }: ConversationDetailProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMessages() {
      setLoading(true);
      const supabase = createClient();
      const { data } = await supabase
        .from("messages")
        .select("id, role, content, created_at")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      setMessages((data as Message[]) ?? []);
      setLoading(false);
    }

    fetchMessages();
  }, [conversationId]);

  if (loading) {
    return (
      <GlassCard className="py-8 text-center">
        <p className="text-sm text-muted">Loading messages...</p>
      </GlassCard>
    );
  }

  if (messages.length === 0) {
    return (
      <GlassCard className="py-8 text-center">
        <p className="text-sm text-muted">No messages in this conversation.</p>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="max-h-[500px] space-y-3 overflow-y-auto">
      {messages.map((msg) => (
        <ChatBubble key={msg.id} role={msg.role} content={msg.content} />
      ))}
    </GlassCard>
  );
}
