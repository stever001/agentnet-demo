// Dashboard.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [agents, setAgents] = useState([]);
  const baseURL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const res = await fetch(`${baseURL}/api/agents`);
        const data = await res.json();
        setAgents(data);
      } catch (err) {
        console.error('Error fetching agents:', err);
      }
    };

    fetchAgents();
    const intervalId = setInterval(fetchAgents, 5000);
    return () => clearInterval(intervalId);
  }, [baseURL]);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Published Agents</h2>
      {agents.length === 0 ? (
        <p className="text-gray-600">No agents published yet.</p>
      ) : (
        <ul className="space-y-4">
          {agents.map((agent) => (
            <li key={agent.id} className="border p-4 rounded shadow-sm bg-white">
              <Link
                to={`/agents/${agent.id}`}
                className="text-blue-600 hover:text-blue-800 underline font-semibold block mb-1"
              >
                {agent.name}
              </Link>
              <div className="text-gray-700">{agent.description}</div>
              {agent.url && (
                <a
                  href={agent.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-500 hover:underline"
                >
                  {agent.url}
                </a>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
