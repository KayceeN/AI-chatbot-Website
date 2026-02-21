import { MessageSquare } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

export default function ChatPage() {
  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold text-ink">Chatbot Management</h1>
      <GlassCard className="text-center">
        <MessageSquare className="mx-auto mb-4 h-12 w-12 text-muted" />
        <h2 className="mb-2 text-lg font-semibold text-ink">Coming in Phase E</h2>
        <p className="text-sm text-muted">
          Configure your AI chatbot, manage your knowledge base, and test
          responses.
        </p>
      </GlassCard>
    </div>
  );
}
