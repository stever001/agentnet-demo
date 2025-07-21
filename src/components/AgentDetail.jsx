import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

// Utility to get relative time string
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
  const [rescanStatus, setRescanStatus] = useState('');
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
    setRescanStatus('⏳ Rescanning...');
    setIsRescanning(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/bot/rescan/${id}`, {
        method: 'POST',
      });

      if (!res.ok) throw new Error('Failed to trigger bot');
      setRescanStatus('✅ Rescan started');

      // Give bot time to complete, then refresh data
      setTimeout(() => {
        fetchAgent();
        setRescanStatus('');
        setIsRescanning(false);
      }, 3000);
    } catch (err) {
      console.error(err);
      setRescanStatus('❌ Error triggering rescan');
      setIsRescanning(false);
    }
  };

  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!data) return <div className="p-6">Loading...</div>;

  const { agent, schemas } = data;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">{agent.name}</h1>
      <p className="text-gray-700 mb-2">{agent.description}</p>

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
      {rescanStatus && <p className="text-sm text-gray-600 mb-4">{rescanStatus}</p>}

      <h2 className="text-xl font-semibold mb-2">
        Schemas ({schemas.length})
      </h2>

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
