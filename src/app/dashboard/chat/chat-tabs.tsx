"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { ConversationList } from "@/components/dashboard/ConversationList";
import { ConversationDetail } from "@/components/dashboard/ConversationDetail";
import { KnowledgeBaseEditor } from "@/components/dashboard/KnowledgeBaseEditor";

const tabs = [
  { id: "conversations", label: "Conversations" },
  { id: "knowledge", label: "Knowledge Base" },
] as const;

type TabId = (typeof tabs)[number]["id"];

interface ChatManagementTabsProps {
  conversations: Array<{
    id: string;
    title: string | null;
    created_at: string;
    message_count: number;
  }>;
  kbEntries: Array<{
    id: string;
    title: string;
    content: string;
    created_at: string;
  }>;
}

export function ChatManagementTabs({
  conversations,
  kbEntries,
}: ChatManagementTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>("conversations");
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);

  return (
    <div>
      {/* Tab bar */}
      <div className="mb-6 flex gap-1 rounded-lg bg-white/50 p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="relative rounded-md px-4 py-2 text-sm font-medium transition-colors"
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="chat-tab-active"
                className="absolute inset-0 rounded-md bg-white shadow-sm"
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
              />
            )}
            <span
              className={`relative ${
                activeTab === tab.id ? "text-ink" : "text-muted"
              }`}
            >
              {tab.label}
            </span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "conversations" && (
        <div className="grid gap-4 lg:grid-cols-2">
          <ConversationList
            conversations={conversations}
            selectedId={selectedConvId}
            onSelect={setSelectedConvId}
          />
          {selectedConvId && (
            <ConversationDetail conversationId={selectedConvId} />
          )}
        </div>
      )}

      {activeTab === "knowledge" && (
        <KnowledgeBaseEditor entries={kbEntries} />
      )}
    </div>
  );
}
