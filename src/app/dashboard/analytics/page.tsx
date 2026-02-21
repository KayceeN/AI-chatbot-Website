import { BarChart3 } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

export default function AnalyticsPage() {
  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold text-ink">Analytics</h1>
      <GlassCard className="text-center">
        <BarChart3 className="mx-auto mb-4 h-12 w-12 text-muted" />
        <h2 className="mb-2 text-lg font-semibold text-ink">Coming in Phase G</h2>
        <p className="text-sm text-muted">
          Track conversations, bookings, and engagement metrics.
        </p>
      </GlassCard>
    </div>
  );
}
