import { useQuery } from "wasp/client/operations";
import { getTenant } from "wasp/client/operations";
import { Link } from "wasp/client/router";

export function DashboardPage() {
  const { data: tenant, isLoading, error } = useQuery(getTenant);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="font-mono text-xs uppercase tracking-wider text-slate">
          Loading…
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-screen-lg px-6 py-10">
        <div className="border border-red-200 bg-red-50 p-4">
          <span className="font-mono text-xs text-red-600">
            Error loading tenant: {error.message}
          </span>
        </div>
      </div>
    );
  }

  const domains = tenant?.domains ?? [];
  const healthyDomains = domains.filter((d: any) => d.status === "HEALTHY").length;
  const warmingDomains = domains.filter((d: any) => d.status === "WARMING").length;

  return (
    <div className="mx-auto max-w-screen-xl px-6 py-10">
      <div className="mb-8">
        <h1 className="font-mono text-2xl font-bold text-bone">
          {tenant?.name ?? "Dashboard"}
        </h1>
        <p className="mt-1 font-mono text-xs uppercase tracking-wider text-slate">
          {tenant?.plan ?? "SELF_SERVE"} plan · {domains.length} domain{domains.length !== 1 ? "s" : ""} configured
        </p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="stat-card">
          <div className="stat-value">{domains.length}</div>
          <div className="stat-label">Total Domains</div>
        </div>
        <div className="stat-card">
          <div className="stat-value text-phosphor">{healthyDomains}</div>
          <div className="stat-label">Healthy</div>
        </div>
        <div className="stat-card">
          <div className="stat-value text-amber">{warmingDomains}</div>
          <div className="stat-label">Warming</div>
        </div>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-mono text-sm font-bold uppercase tracking-wider text-bone">
          Domains
        </h2>
        <Link to="/domains" className="btn-primary text-xs">
          Manage Domains
        </Link>
      </div>

      {domains.length === 0 ? (
        <div className="border border-hairline bg-plate p-8 text-center">
          <p className="font-mono text-sm text-slate">
            No domains configured yet.
          </p>
          <Link to="/domains" className="btn-primary mt-4 text-xs">
            Add Your First Domain
          </Link>
        </div>
      ) : (
        <div className="border border-hairline">
          <table className="w-full">
            <thead>
              <tr className="border-b border-hairline bg-plate">
                <th className="px-4 py-2 text-left font-mono text-xs uppercase tracking-wider text-slate">
                  Domain
                </th>
                <th className="px-4 py-2 text-left font-mono text-xs uppercase tracking-wider text-slate">
                  SPF
                </th>
                <th className="px-4 py-2 text-left font-mono text-xs uppercase tracking-wider text-slate">
                  DKIM
                </th>
                <th className="px-4 py-2 text-left font-mono text-xs uppercase tracking-wider text-slate">
                  DMARC
                </th>
                <th className="px-4 py-2 text-left font-mono text-xs uppercase tracking-wider text-slate">
                  Warmup
                </th>
                <th className="px-4 py-2 text-left font-mono text-xs uppercase tracking-wider text-slate">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {domains.map((domain: any) => (
                <tr key={domain.id} className="border-b border-hairline last:border-0">
                  <td className="px-4 py-3 font-mono text-sm text-bone">
                    {domain.domain}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={domain.spfStatus} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={domain.dkimStatus} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={domain.dmarcStatus} />
                  </td>
                  <td className="px-4 py-3 font-mono text-sm text-bone">
                    {domain.warmupDay}/40
                  </td>
                  <td className="px-4 py-3">
                    <DomainStatusBadge status={domain.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    verified: "bg-phosphor/10 text-phosphor border-phosphor/20",
    failed: "bg-red-50 text-red-600 border-red-200",
    pending: "bg-amber/10 text-amber border-amber/20",
  };

  return (
    <span
      className={`inline-block border px-2 py-0.5 font-mono text-xs ${
        colors[status] ?? colors.pending
      }`}
    >
      {status}
    </span>
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
