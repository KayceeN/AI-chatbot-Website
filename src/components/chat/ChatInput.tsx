"use client";

import { useRef, useEffect } from "react";
import { SendHorizonal } from "lucide-react";

interface ChatInputProps {
  input: string;
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
}

export function ChatInput({
  input,
  onInputChange,
  onSubmit,
  isLoading,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
    }
  }, [input]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !isLoading) {
        const form = e.currentTarget.form;
        if (form) form.requestSubmit();
      }
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex items-end gap-2 border-t border-white/50 p-3">
      <textarea
        ref={textareaRef}
        value={input}
        onChange={onInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Ask me anything..."
        rows={1}
        disabled={isLoading}
        className="flex-1 resize-none rounded-xl bg-white/60 px-3 py-2 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-ink/20 disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={isLoading || !input.trim()}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-ink text-white transition-opacity disabled:opacity-30"
        aria-label="Send message"
      >
        <SendHorizonal className="h-4 w-4" />
      </button>
    </form>
  );
}
