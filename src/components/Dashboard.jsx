// Dashboard.jsx
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [agents, setAgents] = useState([]);
  const baseURL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    fetch(`${baseURL}/api/agents`)
      .then((res) => res.json())
      .then((data) => setAgents(data))
      .catch((err) => console.error('Error fetching agents:', err));
  }, []);

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Published Agents</h2>
      {agents.length === 0 ? (
        <p>No agents published yet.</p>
      ) : (
        <ul>
          {agents.map((agent) => (
            <li key={agent.id}>
              <strong>{agent.name}</strong>: {agent.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
