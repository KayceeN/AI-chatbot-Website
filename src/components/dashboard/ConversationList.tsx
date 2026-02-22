"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { MessageSquare } from "lucide-react";

interface Conversation {
  id: string;
  title: string | null;
  created_at: string;
  message_count: number;
}

interface ConversationListProps {
  conversations: Conversation[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function ConversationList({
  conversations,
  selectedId,
  onSelect,
}: ConversationListProps) {
  if (conversations.length === 0) {
    return (
      <GlassCard className="py-12 text-center">
        <MessageSquare className="mx-auto mb-3 h-10 w-10 text-muted" />
        <p className="text-sm text-muted">
          No conversations yet. Visitors will appear here once they start
          chatting.
        </p>
      </GlassCard>
    );
  }

  return (
    <div className="space-y-2">
      {conversations.map((conv) => (
        <button
          key={conv.id}
          onClick={() => onSelect(conv.id)}
          className={`w-full rounded-lg border px-4 py-3 text-left transition-colors ${
            selectedId === conv.id
              ? "border-ink/20 bg-white"
              : "border-transparent bg-white/50 hover:bg-white/80"
          }`}
        >
          <p className="truncate text-sm font-medium text-ink">
            {conv.title || "Untitled conversation"}
          </p>
          <div className="mt-1 flex items-center gap-2 text-xs text-muted">
            <span>{new Date(conv.created_at).toLocaleDateString()}</span>
            <span>&middot;</span>
            <span>{conv.message_count} messages</span>
          </div>
        </button>
      ))}
    </div>
  );
}
