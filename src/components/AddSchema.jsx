// AddSchema.jsx
import { useEffect, useState } from 'react';
import SchemaForm from './SchemaForm';

export default function AddSchema() {
  const [agents, setAgents] = useState([]);
  const [selectedAgentId, setSelectedAgentId] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/agents`)
      .then((res) => res.json())
      .then((data) => setAgents(data));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Attach JSON-LD to Existing Agent</h1>

      <select
        value={selectedAgentId || ''}
        onChange={(e) => setSelectedAgentId(e.target.value)}
        className="w-full p-2 border rounded mb-6"
      >
        <option value="" disabled>Select an agent...</option>
        {agents.map((agent) => (
          <option key={agent.id} value={agent.id}>
            {agent.name} — {agent.description}
          </option>
        ))}
      </select>

      {selectedAgentId && <SchemaForm agentId={selectedAgentId} />}
    </div>
  );
}
