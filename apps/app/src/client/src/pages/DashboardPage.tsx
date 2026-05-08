import { Link } from 'react-router-dom';
import { useQuery } from 'wasp/client';
import { getTenant } from 'wasp/client/operations';

export const DashboardPage = () => {
  const { data: tenant, isLoading, error } = useQuery(getTenant);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="min-h-screen bg-[#0E1014] text-[#E7E2D7] p-8">
      <h1 className="text-3xl font-bold mb-8" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
        Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#19222B] p-6 rounded-lg">
          <h3 className="text-[#7E8590] text-sm font-mono mb-2">PLAN</h3>
          <p className="text-2xl font-bold" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
            {tenant?.plan}
          </p>
        </div>
        <div className="bg-[#19222B] p-6 rounded-lg">
          <h3 className="text-[#7E8590] text-sm font-mono mb-2">DOMAINS</h3>
          <p className="text-2xl font-bold" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
            {tenant?.domains?.length || 0}
          </p>
        </div>
        <div className="bg-[#19222B] p-6 rounded-lg">
          <h3 className="text-[#7E8590] text-sm font-mono mb-2">SEQUENCES</h3>
          <p className="text-2xl font-bold" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
            {tenant?.sequences?.length || 0}
          </p>
        </div>
      </div>

      <div className="bg-[#19222B] p-6 rounded-lg mb-8">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="flex gap-4">
          <Link
            to="/domains"
            className="bg-[#F26B1F] text-white px-6 py-3 rounded font-mono font-medium hover:bg-orange-600"
          >
            Manage Domains
          </Link>
          <Link
            to="/sequences"
            className="bg-[#19222B] text-[#E7E2D7] px-6 py-3 rounded font-mono font-medium border border-[#3A4651] hover:border-[#F26B1F]"
          >
            View Sequences
          </Link>
        </div>
      </div>

      <div className="bg-[#19222B] p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Tenant Info</h2>
        <p className="text-[#C2BCAD]">
          <span className="text-[#7E8590]">Name:</span> {tenant?.name}
        </p>
        <p className="text-[#C2BCAD]">
          <span className="text-[#7E8590]">CRM:</span> {tenant?.crm}
        </p>
        <p className="text-[#C2BCAD]">
          <span className="text-[#7E8590]">Created:</span> {new Date(tenant?.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};
