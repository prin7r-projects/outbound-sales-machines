import { Link } from 'react-router-dom';
import { useQuery } from 'wasp/client';
import { getSequences } from 'wasp/client/operations';

export const SequencesPage = () => {
  const { data: sequences, isLoading, error } = useQuery(getSequences);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="min-h-screen bg-[#0E1014] text-[#E7E2D7] p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
          Sequences
        </h1>
        <button className="bg-[#F26B1F] text-white px-6 py-3 rounded font-mono font-medium">
          Create Sequence
        </button>
      </div>

      <div className="bg-[#19222B] p-6 rounded-lg">
        {sequences && sequences.length > 0 ? (
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-[#3A4651]">
                <th className="pb-2">Name</th>
                <th className="pb-2">Status</th>
                <th className="pb-2">Steps</th>
                <th className="pb-2">Version</th>
                <th className="pb-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sequences.map((seq: any) => (
                <tr key={seq.id} className="border-b border-[#2A3540]">
                  <td className="py-3">{seq.name}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded text-sm font-mono ${
                      seq.status === 'ACTIVE' ? 'bg-green-600' : 
                      seq.status === 'PAUSED' ? 'bg-yellow-600' : 'bg-gray-600'
                    }`}>
                      {seq.status}
                    </span>
                  </td>
                  <td className="py-3">{seq.steps?.length || 0}</td>
                  <td className="py-3 font-mono">v{seq.version}</td>
                  <td className="py-3">
                    <button className="text-[#F26B1F] hover:underline mr-4">Edit</button>
                    <button className="text-[#F26B1F] hover:underline">Launch</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-12">
            <p className="text-[#7E8590] mb-4">No sequences yet.</p>
            <p className="text-[#C2BCAD] text-sm">
              Create your first sequence to start outbound campaigns.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
