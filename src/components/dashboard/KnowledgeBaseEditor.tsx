"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Plus, Pencil, Trash2 } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface KBEntry {
  id: string;
  title: string;
  content: string;
  created_at: string;
}

interface KnowledgeBaseEditorProps {
  entries: KBEntry[];
}

export function KnowledgeBaseEditor({ entries: initialEntries }: KnowledgeBaseEditorProps) {
  const router = useRouter();
  const [entries, setEntries] = useState(initialEntries);
  const [editing, setEditing] = useState<KBEntry | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function resetForm() {
    setTitle("");
    setContent("");
    setEditing(null);
    setIsAdding(false);
    setError(null);
  }

  function startEdit(entry: KBEntry) {
    setEditing(entry);
    setTitle(entry.title);
    setContent(entry.content);
    setIsAdding(false);
  }

  function startAdd() {
    resetForm();
    setIsAdding(true);
  }

  async function handleSave() {
    setSaving(true);
    setError(null);

    try {
      if (editing) {
        const res = await fetch("/api/knowledge", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editing.id, title, content }),
        });
        if (!res.ok) throw new Error("Failed to update");
        const updated = await res.json();
        setEntries((prev) =>
          prev.map((e) => (e.id === editing.id ? { ...e, ...updated } : e))
        );
      } else {
        const res = await fetch("/api/knowledge", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, content }),
        });
        if (!res.ok) throw new Error("Failed to create");
        const created = await res.json();
        setEntries((prev) => [created, ...prev]);
      }
      resetForm();
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this knowledge base entry?")) return;

    try {
      const res = await fetch("/api/knowledge", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Failed to delete");
      setEntries((prev) => prev.filter((e) => e.id !== id));
      router.refresh();
    } catch {
      setError("Failed to delete entry.");
    }
  }

  const showForm = isAdding || editing;

  return (
    <div>
      {!showForm && (
        <Button onClick={startAdd} className="mb-4">
          <Plus className="mr-2 h-4 w-4" />
          Add entry
        </Button>
      )}

      {showForm && (
        <GlassCard className="mb-4">
          <h3 className="mb-3 text-sm font-semibold text-ink">
            {editing ? "Edit entry" : "New entry"}
          </h3>
          {error && (
            <div className="mb-3 rounded-lg bg-red-50 p-2 text-sm text-red-600">
              {error}
            </div>
          )}
          <div className="mb-3">
            <Input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <textarea
              placeholder="Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              className="w-full rounded-lg border border-white/75 bg-white/60 px-3 py-2 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-ink/20"
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSave} disabled={saving || !title.trim() || !content.trim()}>
              {saving ? "Saving..." : editing ? "Update" : "Create"}
            </Button>
            <Button variant="ghost" onClick={resetForm}>
              Cancel
            </Button>
          </div>
        </GlassCard>
      )}

      {entries.length === 0 && !showForm ? (
        <GlassCard className="py-12 text-center">
          <BookOpen className="mx-auto mb-3 h-10 w-10 text-muted" />
          <p className="text-sm text-muted">
            No knowledge base entries. Run the seed script or add entries
            manually.
          </p>
        </GlassCard>
      ) : (
        <div className="space-y-2">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="flex items-start gap-3 rounded-lg border border-transparent bg-white/50 px-4 py-3"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-ink">{entry.title}</p>
                <p className="mt-0.5 line-clamp-2 text-xs text-muted">
                  {entry.content}
                </p>
              </div>
              <div className="flex shrink-0 gap-1">
                <button
                  onClick={() => startEdit(entry)}
                  className="rounded p-1.5 text-muted transition-colors hover:text-ink"
                  aria-label="Edit"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(entry.id)}
                  className="rounded p-1.5 text-muted transition-colors hover:text-red-600"
                  aria-label="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
