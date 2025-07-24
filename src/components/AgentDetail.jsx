// src/components/AgentDetail.jsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AgentStatusToggle from './AgentStatusToggle';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function getRelativeTime(dateString) {
  if (!dateString) return 'N/A';
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  const then = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - then) / 1000);

  const ranges = {
    year: 3600 * 24 * 365,
    month: 3600 * 24 * 30,
    day: 3600 * 24,
    hour: 3600,
    minute: 60,
    second: 1,
  };

  for (let key in ranges) {
    const delta = Math.floor(diffInSeconds / ranges[key]);
    if (delta !== 0) {
      return rtf.format(-delta, key);
    }
  }

  return 'just now';
}

export default function AgentDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [isRescanning, setIsRescanning] = useState(false);

  const fetchAgent = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/agents/${id}`);
      if (!res.ok) throw new Error();
      const json = await res.json();
      setData(json);
    } catch {
      setError('Error loading agent');
    }
  };

  useEffect(() => {
    fetchAgent();
  }, [id]);

  const handleRescan = async () => {
    setIsRescanning(true);
    toast.info('⏳ Rescanning site...', { autoClose: 2000 });

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/bot/rescan/${id}`, {
        method: 'POST',
      });

      if (!res.ok) {
        toast.error('❌ Rescan failed – check agent status');
        throw new Error('Failed to trigger bot');
      }

      toast.success('✅ Rescan triggered');
    } catch (err) {
      console.error(err);
      toast.error('❌ Error triggering rescan');
    } finally {
      // Always refresh agent status after rescan
      setTimeout(() => {
        fetchAgent();
        setIsRescanning(false);
      }, 3000);
    }
  };

  const handleStatusChange = async (newStatus, reason = '') => {
    const endpoint = newStatus === 'inactive' ? 'deactivate' : 'reactivate';

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/agents/${id}/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      });

      if (!res.ok) throw new Error();
      toast.success(`✅ Agent ${newStatus === 'inactive' ? 'deactivated' : 'reactivated'}`);
      setTimeout(() => fetchAgent(), 1500);
    } catch (err) {
      toast.error(`❌ Failed to ${endpoint} agent`);
    }
  };

  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!data) return <div className="p-6">Loading...</div>;

  const { agent, schemas = [] } = data;

  return (
    <div className="p-6">
      <ToastContainer position="top-center" />
      <h1 className="text-2xl font-bold mb-2">{agent.name}</h1>
      <p className="text-gray-700 mb-2">{agent.description}</p>

      {agent.status === 'inactive' && (
        <div className="mb-3 p-2 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
          <strong>Inactive</strong>{' '}
          {agent.deactivationReason && <>– {agent.deactivationReason}</>}
          {agent.deactivatedAt && (
            <span className="ml-1 text-sm">({getRelativeTime(agent.deactivatedAt)})</span>
          )}
        </div>
      )}

      {agent.lastCrawledAt && (
        <p className="text-sm text-gray-500 mb-1">
          Last crawled: {getRelativeTime(agent.lastCrawledAt)}
        </p>
      )}

      {agent.url && (
        <p className="mb-4">
          <a
            href={agent.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            {agent.url}
          </a>
        </p>
      )}

      <button
        onClick={handleRescan}
        className={`mb-4 px-4 py-2 rounded text-white ${
          isRescanning ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
        }`}
        disabled={isRescanning}
      >
        {isRescanning ? '🔄 Rescanning...' : '🔁 Rescan Agent'}
      </button>

      <AgentStatusToggle agent={agent} onChange={handleStatusChange} />

      <h2 className="text-xl font-semibold mt-6 mb-2">Schemas ({schemas.length})</h2>

      {schemas.length === 0 ? (
        <p className="text-gray-500">No schemas submitted.</p>
      ) : (
        <ul className="space-y-4">
          {schemas.map((s) => (
            <li key={s.id} className="p-4 bg-gray-100 rounded">
              {s.label && <p className="font-semibold underline mb-1">{s.label}</p>}
              <pre className="text-sm overflow-x-auto whitespace-pre-wrap">{s.jsonLd}</pre>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
