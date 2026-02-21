-- Vector similarity search function for RAG retrieval.
-- Called from src/lib/chatbot/knowledge.ts via supabase.rpc('match_knowledge_base', ...).
-- Returns top-K knowledge base entries ranked by cosine similarity to the query embedding.
CREATE OR REPLACE FUNCTION match_knowledge_base(
  query_embedding vector(1536),
  match_user_id UUID,
  match_count INT DEFAULT 5
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  content TEXT,
  similarity FLOAT
)
LANGUAGE sql STABLE
AS $$
  SELECT
    knowledge_base.id,
    knowledge_base.title,
    knowledge_base.content,
    1 - (knowledge_base.embedding <=> query_embedding) AS similarity
  FROM knowledge_base
  WHERE knowledge_base.user_id = match_user_id
    AND knowledge_base.type = 'text'
    AND knowledge_base.embedding IS NOT NULL
  ORDER BY knowledge_base.embedding <=> query_embedding
  LIMIT match_count;
$$;
