import { embed } from "ai";
import { openai } from "@/lib/openai/client";
import type { RetrievedChunk } from "./system-prompt";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function retrieveChunks(
  supabase: SupabaseClient,
  query: string,
  userId: string,
  topK = 5
): Promise<RetrievedChunk[]> {
  // Generate embedding for the query
  const { embedding } = await embed({
    model: openai.embedding("text-embedding-3-small"),
    value: query,
  });

  // Query pgvector for similar chunks
  const { data, error } = await supabase.rpc("match_knowledge_base", {
    query_embedding: embedding,
    match_user_id: userId,
    match_count: topK,
  });

  if (error) {
    console.error("Knowledge retrieval error:", error.message);
    return [];
  }

  return (data ?? []) as RetrievedChunk[];
}
