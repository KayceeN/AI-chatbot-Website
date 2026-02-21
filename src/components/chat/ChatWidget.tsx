"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import type { UIMessage } from "ai";
import { MessageSquare, X } from "lucide-react";
import { ChatBubble, TypingIndicator } from "./ChatBubble";
import { ChatInput } from "./ChatInput";

/** Extract concatenated text from a UIMessage's parts array. */
function getMessageText(msg: UIMessage): string {
  return msg.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("");
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [conversationId, setConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const conversationIdRef = useRef<string | null>(null);

  // Keep ref in sync so the transport body closure reads the latest value
  useEffect(() => {
    conversationIdRef.current = conversationId;
  }, [conversationId]);

  // Restore conversation ID from sessionStorage
  useEffect(() => {
    const stored = sessionStorage.getItem("kayphi-conversation-id");
    if (stored) {
      setConversationId(stored);
      conversationIdRef.current = stored;
    }
  }, []);

  // Build transport with a dynamic body that includes conversationId,
  // and a custom fetch wrapper to capture the x-conversation-id response header.
  const [transport] = useState(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        body: () => ({ conversationId: conversationIdRef.current }),
        fetch: async (url, init) => {
          const response = await globalThis.fetch(url, init);
          const newId = response.headers.get("x-conversation-id");
          if (newId && newId !== conversationIdRef.current) {
            conversationIdRef.current = newId;
            setConversationId(newId);
            sessionStorage.setItem("kayphi-conversation-id", newId);
          }
          return response;
        },
      })
  );

  const { messages, sendMessage, status } = useChat({ transport });

  const isLoading = status === "submitted" || status === "streaming";

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, status]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInput(e.target.value);
    },
    []
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const text = input.trim();
      if (!text || isLoading) return;
      setInput("");
      sendMessage({ text });
    },
    [input, isLoading, sendMessage]
  );

  return (
    <>
      {/* Floating bubble */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-ink text-white shadow-button transition-transform hover:scale-105"
          aria-label="Open chat"
        >
          <MessageSquare className="h-6 w-6" />
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 flex h-[500px] w-[400px] flex-col overflow-hidden rounded-panel border border-white/75 bg-panel/90 shadow-plate backdrop-blur max-sm:bottom-0 max-sm:right-0 max-sm:h-full max-sm:w-full max-sm:rounded-none">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/50 px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-ink">
                <span className="relative inline-flex h-3 w-3 items-center justify-center">
                  <span className="absolute h-1.5 w-1.5 -translate-x-[3px] rotate-45 rounded-sm bg-white" />
                  <span className="absolute h-1.5 w-1.5 translate-x-[3px] rotate-45 rounded-sm bg-white" />
                </span>
              </div>
              <span className="text-sm font-semibold text-ink">kAyphI Assistant</span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="rounded-lg p-1 text-muted transition-colors hover:text-ink"
              aria-label="Close chat"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.length === 0 && (
              <div className="py-8 text-center text-sm text-muted">
                <p className="mb-1 font-medium text-ink">
                  Hi! I&apos;m the kAyphI assistant.
                </p>
                <p>Ask me about our services, pricing, or how we can help your business.</p>
              </div>
            )}
            {messages.map((msg) => (
              <ChatBubble
                key={msg.id}
                role={msg.role as "user" | "assistant"}
                content={getMessageText(msg)}
              />
            ))}
            {isLoading &&
              messages[messages.length - 1]?.role === "user" && (
                <TypingIndicator />
              )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <ChatInput
            input={input}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </div>
      )}
    </>
  );
}
