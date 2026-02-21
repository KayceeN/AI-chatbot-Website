-- Workflow runs table (execution history)
CREATE TABLE IF NOT EXISTS public.workflow_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID NOT NULL REFERENCES public.workflows(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'success', 'failed')),
  input JSONB,
  output JSONB,
  error TEXT,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX idx_workflow_runs_workflow_id ON public.workflow_runs(workflow_id);

ALTER TABLE public.workflow_runs ENABLE ROW LEVEL SECURITY;

-- Owner can read/delete runs for their workflows
CREATE POLICY "Users can view runs for own workflows"
  ON public.workflow_runs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.workflows
      WHERE workflows.id = workflow_runs.workflow_id
      AND workflows.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create runs for own workflows"
  ON public.workflow_runs FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.workflows
      WHERE workflows.id = workflow_runs.workflow_id
      AND workflows.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete runs for own workflows"
  ON public.workflow_runs FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.workflows
      WHERE workflows.id = workflow_runs.workflow_id
      AND workflows.user_id = auth.uid()
    )
  );
