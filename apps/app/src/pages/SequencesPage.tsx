import { useQuery } from "wasp/client/operations";
import { getSequences } from "wasp/client/operations";
import { Link } from "wasp/client/router";

export function SequencesPage() {
  const { data: sequences, isLoading, error } = useQuery(getSequences);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="font-mono text-xs uppercase tracking-wider text-slate">
          Loading sequences…
        </span>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-screen-xl px-6 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-mono text-2xl font-bold text-bone">Sequences</h1>
          <p className="mt-1 font-mono text-xs uppercase tracking-wider text-slate">
            Multi-channel outbound sequences
          </p>
        </div>
        <button className="btn-primary text-xs" disabled>
          Create Sequence
        </button>
      </div>

      {error && (
        <div className="mb-6 border border-red-200 bg-red-50 p-4">
          <span className="font-mono text-xs text-red-600">
            Error: {error.message}
          </span>
        </div>
      )}

      <div className="mb-4 flex items-center justify-between border border-phosphor/20 bg-phosphor/5 p-4">
        <span className="font-mono text-xs text-phosphor">
          Multi-channel sequence builder is ready. Create 6-step sequences across email, LinkedIn, and voice.
        </span>
        <Link to="/sequences/builder" className="btn-primary text-xs">
          Open Builder
        </Link>
      </div>

      {!sequences || sequences.length === 0 ? (
        <div className="border border-hairline bg-plate p-8 text-center">
          <p className="font-mono text-sm text-slate">
            No sequences yet. Sequences will be available once domains are warmed up.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sequences.map((seq: any) => (
            <div key={seq.id} className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-mono text-lg font-bold text-bone">
                    {seq.name}
                  </h3>
                  <p className="font-mono text-xs text-slate">
                    v{seq.version} · {seq.steps?.length ?? 0} steps ·{" "}
                    {seq.status}
                  </p>
                </div>
                <SequenceStatusBadge status={seq.status} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SequenceStatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    ACTIVE: "bg-phosphor/10 text-phosphor border-phosphor/20",
    DRAFT: "bg-plate text-slate border-hairline",
    PAUSED: "bg-amber/10 text-amber border-amber/20",
  };

  return (
    <span
      className={`inline-block border px-2 py-0.5 font-mono text-xs ${
        colors[status] ?? colors.DRAFT
      }`}
    >
      {status}
    </span>
  );
}
