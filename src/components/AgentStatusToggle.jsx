import { useState } from 'react';
import { toast } from 'react-toastify';

export default function AgentStatusToggle({ agent, onChange }) {
  const [deactivationReason, setDeactivationReason] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDeactivate = async () => {
    if (!deactivationReason) {
      toast.warning('⚠️ Please select a deactivation reason.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/agents/${agent.id}/deactivate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: deactivationReason }),
      });

      if (!res.ok) throw new Error('Deactivation failed');
      toast.success('✅ Agent deactivated');
      onChange?.('inactive', deactivationReason);
    } catch (err) {
      toast.error('❌ Failed to deactivate agent');
    } finally {
      setLoading(false);
    }
  };

  const handleReactivate = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/agents/${agent.id}/reactivate`, {
        method: 'POST',
      });

      if (!res.ok) throw new Error('Reactivation failed');
      toast.success('✅ Agent reactivated');
      onChange?.('active');
    } catch (err) {
      toast.error('❌ Failed to reactivate agent');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border rounded p-4 mb-4">
      <h3 className="font-semibold mb-2">Agent Status</h3>
      <p className="mb-2">
        Current status:{' '}
        <span className={`font-bold ${agent.status === 'active' ? 'text-green-600' : 'text-gray-700'}`}>
          {agent.status}
        </span>
        {agent.deactivatedAt && agent.status === 'inactive' && (
          <span className="text-sm text-gray-500"> (since {new Date(agent.deactivatedAt).toLocaleString()})</span>
        )}
      </p>

      {agent.status === 'active' ? (
        <>
          <label htmlFor="deactivationReason" className="block text-sm mb-1">
            Deactivation Reason
          </label>
          <select
            id="deactivationReason"
            className="w-full mb-3 border border-gray-300 p-2 rounded"
            value={deactivationReason}
            onChange={(e) => setDeactivationReason(e.target.value)}
            disabled={loading}
          >
            <option value="">Select a reason</option>
            <option value="Unreachable site">Unreachable site</option>
            <option value="Invalid schema">Invalid schema</option>
            <option value="Broken or malicious content">Broken or malicious content</option>
            <option value="Manual admin action">Manual admin action</option>
          </select>

          <button
            onClick={handleDeactivate}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded disabled:opacity-50"
            disabled={loading || !deactivationReason}
          >
            {loading ? 'Deactivating...' : 'Deactivate Agent'}
          </button>
        </>
      ) : (
        <button
          onClick={handleReactivate}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Reactivating...' : 'Reactivate Agent'}
        </button>
      )}
    </div>
  );
}
