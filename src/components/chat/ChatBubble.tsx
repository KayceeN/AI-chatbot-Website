interface ChatBubbleProps {
  role: "user" | "assistant";
  content: string;
}

export function ChatBubble({ role, content }: ChatBubbleProps) {
  if (role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] rounded-2xl bg-ink px-4 py-2.5 text-sm text-white">
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink">
        <span className="relative inline-flex h-3 w-3 items-center justify-center">
          <span className="absolute h-1.5 w-1.5 -translate-x-[3px] rotate-45 rounded-sm bg-white" />
          <span className="absolute h-1.5 w-1.5 translate-x-[3px] rotate-45 rounded-sm bg-white" />
        </span>
      </div>
      <div className="max-w-[80%] rounded-2xl bg-white/80 px-4 py-2.5 text-sm text-ink">
        {content}
      </div>
    </div>
  );
}

export function TypingIndicator() {
  return (
    <div className="flex gap-2">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink">
        <span className="relative inline-flex h-3 w-3 items-center justify-center">
          <span className="absolute h-1.5 w-1.5 -translate-x-[3px] rotate-45 rounded-sm bg-white" />
          <span className="absolute h-1.5 w-1.5 translate-x-[3px] rotate-45 rounded-sm bg-white" />
        </span>
      </div>
      <div className="flex items-center gap-1 rounded-2xl bg-white/80 px-4 py-3">
        <span className="h-2 w-2 animate-bounce rounded-full bg-muted [animation-delay:0ms]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-muted [animation-delay:150ms]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-muted [animation-delay:300ms]" />
      </div>
    </div>
  );
}
