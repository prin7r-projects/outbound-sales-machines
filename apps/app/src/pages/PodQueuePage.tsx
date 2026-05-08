import { useState, useEffect } from "react";

interface PodIntervention {
  id: string;
  type: string;
  priority: string;
  status: string;
  tenantName: string;
  domainName?: string;
  sequenceName?: string;
  notes?: string;
  createdAt: string;
}

interface PodQueueItem {
  intervention: PodIntervention;
  assignment: {
    id: string;
    operatorName: string;
    tenantPlan: string;
  };
  ageInMinutes: number;
  isEscalated: boolean;
}

interface PodQueueStats {
  totalAssignments: number;
  activeAssignments: number;
  totalInterventions: number;
  openInterventions: number;
  criticalInterventions: number;
  avgResolutionTimeMinutes: number;
}

export function PodQueuePage() {
  const [queue, setQueue] = useState<PodQueueItem[]>([]);
  const [stats, setStats] = useState<PodQueueStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "critical" | "escalated">("all");

  useEffect(() => {
    fetchQueue();
    const interval = setInterval(fetchQueue, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const fetchQueue = async () => {
    try {
      const res = await fetch("/api/pod/queue");
      if (!res.ok) throw new Error("Failed to fetch queue");
      const data = await res.json();
      setQueue(data.queue);
      setStats(data.stats);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (interventionId: string, status: string) => {
    try {
      const res = await fetch(`/api/pod/interventions/${interventionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update intervention");
      await fetchQueue();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const filteredQueue = queue.filter((item) => {
    if (filter === "critical") return item.intervention.priority === "CRITICAL";
    if (filter === "escalated") return item.isEscalated;
    return true;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="font-mono text-xs uppercase tracking-wider text-slate">
          Loading pod queue…
        </span>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-screen-xl px-6 py-10">
      <div className="mb-8">
        <h1 className="font-mono text-2xl font-bold text-bone">Pod Queue</h1>
        <p className="mt-1 font-mono text-xs uppercase tracking-wider text-slate">
          Managed-tier operator intervention queue
        </p>
      </div>

      {error && (
        <div className="mb-6 border border-red-200 bg-red-50 p-4">
          <span className="font-mono text-xs text-red-600">Error: {error}</span>
        </div>
      )}

      {/* Stats Grid */}
      {stats && (
        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatCard label="Active Assignments" value={stats.activeAssignments} />
          <StatCard
            label="Open Interventions"
            value={stats.openInterventions}
            highlight={stats.openInterventions > 0}
          />
          <StatCard
            label="Critical"
            value={stats.criticalInterventions}
            highlight={stats.criticalInterventions > 0}
            color="red"
          />
          <StatCard
            label="Avg Resolution"
            value={`${stats.avgResolutionTimeMinutes}m`}
          />
        </div>
      )}

      {/* Filters */}
      <div className="mb-6 flex gap-3">
        <FilterButton
          active={filter === "all"}
          onClick={() => setFilter("all")}
        >
          All ({queue.length})
        </FilterButton>
        <FilterButton
          active={filter === "critical"}
          onClick={() => setFilter("critical")}
        >
          Critical ({queue.filter((i) => i.intervention.priority === "CRITICAL").length})
        </FilterButton>
        <FilterButton
          active={filter === "escalated"}
          onClick={() => setFilter("escalated")}
        >
          Escalated ({queue.filter((i) => i.isEscalated).length})
        </FilterButton>
      </div>

      {/* Queue */}
      {filteredQueue.length === 0 ? (
        <div className="border border-hairline bg-plate p-8 text-center">
          <p className="font-mono text-sm text-slate">
            {filter === "all"
              ? "No open interventions. Queue is clear."
              : `No ${filter} interventions.`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredQueue.map((item) => (
            <InterventionCard
              key={item.intervention.id}
              item={item}
              onUpdateStatus={handleUpdateStatus}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  highlight = false,
  color = "default",
}: {
  label: string;
  value: string | number;
  highlight?: boolean;
  color?: "default" | "red";
}) {
  const colorClass =
    color === "red"
      ? "border-red-200 bg-red-50"
      : highlight
        ? "border-amber/20 bg-amber/5"
        : "border-hairline bg-plate";

  const valueColor =
    color === "red"
      ? "text-red-600"
      : highlight
        ? "text-amber"
        : "text-bone";

  return (
    <div className={`border p-4 ${colorClass}`}>
      <p className="font-mono text-xs uppercase tracking-wider text-slate">
        {label}
      </p>
      <p className={`mt-1 font-mono text-2xl font-bold ${valueColor}`}>
        {value}
      </p>
    </div>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`border px-3 py-1.5 font-mono text-xs uppercase tracking-wider ${
        active
          ? "border-signal bg-signal/10 text-signal"
          : "border-hairline bg-plate text-slate hover:border-signal/50"
      }`}
    >
      {children}
    </button>
  );
}

function InterventionCard({
  item,
  onUpdateStatus,
}: {
  item: PodQueueItem;
  onUpdateStatus: (id: string, status: string) => void;
}) {
  const { intervention, assignment, ageInMinutes, isEscalated } = item;

  const priorityColors: Record<string, string> = {
    LOW: "bg-slate/10 text-slate border-slate/20",
    NORMAL: "bg-signal/10 text-signal border-signal/20",
    HIGH: "bg-amber/10 text-amber border-amber/20",
    CRITICAL: "bg-red-50 text-red-600 border-red-200",
  };

  const typeLabels: Record<string, string> = {
    warmup_stall: "Warmup Stall",
    circuit_breaker: "Circuit Breaker",
    sequence_tuning: "Sequence Tuning",
    domain_health: "Domain Health",
    manual: "Manual",
  };

  const formatAge = (minutes: number) => {
    if (minutes < 60) return `${Math.round(minutes)}m`;
    if (minutes < 1440) return `${Math.round(minutes / 60)}h`;
    return `${Math.round(minutes / 1440)}d`;
  };

  return (
    <div
      className={`card p-6 ${isEscalated ? "border-l-4 border-l-amber" : ""}`}
    >
      <div className="mb-4 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h3 className="font-mono text-lg font-bold text-bone">
              {intervention.tenantName}
            </h3>
            <span
              className={`inline-block border px-2 py-0.5 font-mono text-xs ${
                priorityColors[intervention.priority] ?? priorityColors.NORMAL
              }`}
            >
              {intervention.priority}
            </span>
            <span className="font-mono text-xs text-slate">
              {typeLabels[intervention.type] ?? intervention.type}
            </span>
            {isEscalated && (
              <span className="inline-block border border-amber/20 bg-amber/10 px-2 py-0.5 font-mono text-xs text-amber">
                ESCALATED
              </span>
            )}
          </div>
          <p className="mt-1 font-mono text-xs text-slate">
            Operator: {assignment.operatorName} · Age: {formatAge(ageInMinutes)}
          </p>
        </div>
        <div className="flex gap-2">
          {intervention.status === "OPEN" && (
            <button
              onClick={() => onUpdateStatus(intervention.id, "IN_PROGRESS")}
              className="btn-ghost text-xs"
            >
              Start
            </button>
          )}
          {intervention.status !== "RESOLVED" && (
            <button
              onClick={() => onUpdateStatus(intervention.id, "RESOLVED")}
              className="btn-primary text-xs"
            >
              Resolve
            </button>
          )}
        </div>
      </div>

      {(intervention.domainName || intervention.sequenceName) && (
        <div className="mb-3 flex gap-4">
          {intervention.domainName && (
            <span className="font-mono text-xs text-slate">
              Domain: <span className="text-bone">{intervention.domainName}</span>
            </span>
          )}
          {intervention.sequenceName && (
            <span className="font-mono text-xs text-slate">
              Sequence:{" "}
              <span className="text-bone">{intervention.sequenceName}</span>
            </span>
          )}
        </div>
      )}

      {intervention.notes && (
        <div className="border border-hairline bg-plate p-3">
          <p className="font-mono text-xs text-slate">{intervention.notes}</p>
        </div>
      )}
    </div>
  );
}
