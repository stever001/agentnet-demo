import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function AgentDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/agents/${id}`)
      .then(res => res.json())
      .then(setData)
      .catch(() => setError('Error loading agent'));
  }, [id]);

  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!data) return <div className="p-6">Loading...</div>;

  const { agent, schemas } = data;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">{agent.name}</h1>
      <p className="text-gray-700 mb-2">{agent.description}</p>
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

      <h2 className="text-xl font-semibold mb-2">Schemas</h2>
      {schemas.length === 0 ? (
        <p className="text-gray-500">No schemas submitted.</p>
      ) : (
        <ul className="space-y-4">
          {schemas.map((s) => (
            <li key={s.id} className="p-4 bg-gray-100 rounded">
              <Link
                to={`/schemas/${s.id}`}
                className="block text-blue-700 font-semibold hover:underline mb-1"
              >
                {s.label || s.type || s.id}
              </Link>
              <pre className="text-sm overflow-x-auto whitespace-pre-wrap text-gray-700">
                {s.jsonLd}
              </pre>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
