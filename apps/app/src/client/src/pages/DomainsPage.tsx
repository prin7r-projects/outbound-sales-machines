import { useQuery } from 'wasp/client';
import { getDomains } from 'wasp/client/operations';
import { useState } from 'react';

export const DomainsPage = () => {
  const { data: domains, isLoading, error } = useQuery(getDomains);
  const [domain, setDomain] = useState('');

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="min-h-screen bg-[#0E1014] text-[#E7E2D7] p-8">
      <h1 className="text-3xl font-bold mb-8" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
        Domains
      </h1>

      <div className="bg-[#19222B] p-6 rounded-lg mb-8">
        <h2 className="text-xl mb-4">Add Domain</h2>
        <div className="flex gap-4">
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="example.com"
            className="flex-1 bg-[#0B0D11] border border-[#3A4651] rounded px-4 py-2 text-[#E7E2D7]"
          />
          <button className="bg-[#F26B1F] text-white px-6 py-2 rounded font-mono font-medium">
            Verify DNS
          </button>
        </div>
      </div>

      <div className="bg-[#19222B] p-6 rounded-lg">
        <h2 className="text-xl mb-4">Your Domains</h2>
        {domains && domains.length > 0 ? (
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-[#3A4651]">
                <th className="pb-2">Domain</th>
                <th className="pb-2">SPF</th>
                <th className="pb-2">DKIM</th>
                <th className="pb-2">DMARC</th>
                <th className="pb-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {domains.map((d: any) => (
                <tr key={d.id} className="border-b border-[#2A3540]">
                  <td className="py-3">{d.domain}</td>
                  <td className="py-3">
                    <span className={d.spfStatus === 'verified' ? 'text-green-500' : 'text-[#F26B1F]'}>
                      {d.spfStatus}
                    </span>
                  </td>
                  <td className="py-3">
                    <span className={d.dkimStatus === 'verified' ? 'text-green-500' : 'text-[#F26B1F]'}>
                      {d.dkimStatus}
                    </span>
                  </td>
                  <td className="py-3">
                    <span className={d.dmarcStatus === 'verified' ? 'text-green-500' : 'text-[#F26B1F]'}>
                      {d.dmarcStatus}
                    </span>
                  </td>
                  <td className="py-3">
                    <span className="bg-[#F26B1F] text-white px-2 py-1 rounded text-sm font-mono">
                      {d.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-[#7E8590]">No domains added yet.</p>
        )}
      </div>
    </div>
  );
};
