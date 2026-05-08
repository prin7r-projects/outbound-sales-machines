import { useState } from "react";
import { useQuery, useAction } from "wasp/client/operations";
import { getDomains, createDomain, updateDomain } from "wasp/client/operations";

export function DomainsPage() {
  const { data: domains, isLoading, error } = useQuery(getDomains);
  const createDomainFn = useAction(createDomain);
  const updateDomainFn = useAction(updateDomain);
  const [newDomain, setNewDomain] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  const handleAddDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDomain.trim()) return;

    setIsAdding(true);
    setAddError(null);

    try {
      await createDomainFn({ domain: newDomain.trim() });
      setNewDomain("");
    } catch (err: any) {
      setAddError(err.message || "Failed to add domain");
    } finally {
      setIsAdding(false);
    }
  };

  const handleVerify = async (domainId: string) => {
    try {
      await updateDomainFn({
        id: domainId,
        data: { spfStatus: "pending", dkimStatus: "pending", dmarcStatus: "pending" },
      });
    } catch (err: any) {
      console.error("Verify error:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="font-mono text-xs uppercase tracking-wider text-slate">
          Loading domains…
        </span>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-screen-xl px-6 py-10">
      <div className="mb-8">
        <h1 className="font-mono text-2xl font-bold text-bone">Domains</h1>
        <p className="mt-1 font-mono text-xs uppercase tracking-wider text-slate">
          Configure sending domains · DNS verification via Cloudflare
        </p>
      </div>

      <form onSubmit={handleAddDomain} className="mb-8">
        <div className="flex gap-3">
          <input
            type="text"
            value={newDomain}
            onChange={(e) => setNewDomain(e.target.value)}
            placeholder="e.g. mail.example.com"
            className="flex-1 border border-hairline bg-steel px-4 py-2 font-mono text-sm text-bone placeholder:text-slate focus:border-signal focus:outline-none"
            disabled={isAdding}
          />
          <button type="submit" className="btn-primary" disabled={isAdding}>
            {isAdding ? "Adding…" : "Add Domain"}
          </button>
        </div>
        {addError && (
          <p className="mt-2 font-mono text-xs text-red-600">{addError}</p>
        )}
      </form>

      {error && (
        <div className="mb-6 border border-red-200 bg-red-50 p-4">
          <span className="font-mono text-xs text-red-600">
            Error: {error.message}
          </span>
        </div>
      )}

      {!domains || domains.length === 0 ? (
        <div className="border border-hairline bg-plate p-8 text-center">
          <p className="font-mono text-sm text-slate">
            No domains configured. Add your first sending domain above.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {domains.map((domain: any) => (
            <div key={domain.id} className="card p-6">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="font-mono text-lg font-bold text-bone">
                    {domain.domain}
                  </h3>
                  <p className="font-mono text-xs text-slate">
                    Added {new Date(domain.createdAt).toLocaleDateString()} · Warmup day {domain.warmupDay}/40
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <DomainStatusBadge status={domain.status} />
                  <button
                    onClick={() => handleVerify(domain.id)}
                    className="btn-ghost text-xs"
                  >
                    Re-verify DNS
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <DNSCheck label="SPF" status={domain.spfStatus} />
                <DNSCheck label="DKIM" status={domain.dkimStatus} />
                <DNSCheck label="DMARC" status={domain.dmarcStatus} />
              </div>

              {domain.spfStatus === "verified" &&
                domain.dkimStatus === "verified" &&
                domain.dmarcStatus === "verified" && (
                  <div className="mt-4 border border-phosphor/20 bg-phosphor/5 p-3">
                    <span className="font-mono text-xs text-phosphor">
                      ✓ All DNS records verified — domain is warmup ready
                    </span>
                  </div>
                )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function DNSCheck({ label, status }: { label: string; status: string }) {
  const icon =
    status === "verified" ? "✓" : status === "failed" ? "✗" : "…";
  const color =
    status === "verified"
      ? "text-phosphor"
      : status === "failed"
        ? "text-red-600"
        : "text-amber";

  return (
    <div className="border border-hairline bg-plate p-3">
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs uppercase tracking-wider text-slate">
          {label}
        </span>
        <span className={`font-mono text-sm font-bold ${color}`}>{icon}</span>
      </div>
      <p className={`mt-1 font-mono text-xs ${color}`}>{status}</p>
    </div>
  );
}

function DomainStatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    HEALTHY: "bg-phosphor/10 text-phosphor border-phosphor/20",
    WARMING: "bg-amber/10 text-amber border-amber/20",
    PAUSED: "bg-plate text-slate border-hairline",
    EXPIRING: "bg-red-50 text-red-600 border-red-200",
  };

  return (
    <span
      className={`inline-block border px-2 py-0.5 font-mono text-xs ${
        colors[status] ?? colors.WARMING
      }`}
    >
      {status}
    </span>
  );
}
