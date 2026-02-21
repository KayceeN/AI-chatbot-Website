-- Enable pgvector extension for embedding storage
CREATE EXTENSION IF NOT EXISTS vector;

-- Knowledge base table (documents + embeddings for RAG retrieval)
CREATE TABLE IF NOT EXISTS public.knowledge_base (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL DEFAULT 'text' CHECK (type IN ('text', 'image')),
  title TEXT NOT NULL,
  content TEXT,
  embedding vector(1536),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_knowledge_base_user_id ON public.knowledge_base(user_id);

ALTER TABLE public.knowledge_base ENABLE ROW LEVEL SECURITY;

-- Public SELECT for chatbot retrieval (visitors can query the KB).
-- TODO(Phase E): For multi-tenant deployment, scope this to per-business-owner
-- rows or replace with an RPC function that filters by business context.
-- Current single-tenant use (kAyphI's own site) is acceptable — KB content is
-- public info (services, pricing, FAQ visible on the marketing site).
CREATE POLICY "Anyone can read knowledge base entries"
  ON public.knowledge_base FOR SELECT
  USING (true);

-- Owner CRUD
CREATE POLICY "Users can insert own knowledge base entries"
  ON public.knowledge_base FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own knowledge base entries"
  ON public.knowledge_base FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own knowledge base entries"
  ON public.knowledge_base FOR DELETE
  USING (auth.uid() = user_id);

CREATE OR REPLACE TRIGGER knowledge_base_updated_at
  BEFORE UPDATE ON public.knowledge_base
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
