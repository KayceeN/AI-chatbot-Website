import { Workflow } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

export default function WorkflowsPage() {
  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold text-ink">Workflows</h1>
      <GlassCard className="text-center">
        <Workflow className="mx-auto mb-4 h-12 w-12 text-muted" />
        <h2 className="mb-2 text-lg font-semibold text-ink">Coming in Phase F</h2>
        <p className="text-sm text-muted">
          Build and manage automated workflows for your business processes.
        </p>
      </GlassCard>
    </div>
  );
}
