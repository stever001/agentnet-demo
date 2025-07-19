// Dashboard.jsx
import { useEffect, useState } from 'react';

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

    fetchAgents(); // fetch once immediately

    const intervalId = setInterval(fetchAgents, 5000); // fetch every 5 seconds

    return () => clearInterval(intervalId); // cleanup on unmount
  }, [baseURL]);

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
              {agent.url && (
                <div>
                  <a href={agent.url} target="_blank" rel="noopener noreferrer">
                    {agent.url}
                  </a>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

