import { useState } from 'react';
import SchemaForm from './SchemaForm';

export default function Publish() {
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    description: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [newAgentId, setNewAgentId] = useState(null);
  const [agentMeta, setAgentMeta] = useState(null); // Store full agent info

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/agents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    if (res.ok) {
  const data = await res.json();
  setNewAgentId(data.id);
  setAgentMeta({
    ...formData,  // reuse input data
    id: data.id   // add returned ID
  });
  setSubmitted(true);
  setFormData({ name: '', url: '', description: '' });
}

  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Publish a New Agent</h1>

      {submitted && (
        <p className="text-green-600 mb-4">
          Agent published successfully! Agent ID: {newAgentId}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Agent Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Site URL:</label>
          <input
            type="url"
            name="url"
            value={formData.url}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Publish Agent
        </button>
      </form>

      {newAgentId && (
        <>
          <hr className="my-8 border-t border-gray-300" />
          <h2 className="text-xl font-semibold mb-2">
            Submit JSON-LD Schema for Agent #{newAgentId}
          </h2>

          {agentMeta && (
            <div className="mb-4 p-4 bg-gray-50 border border-gray-300 rounded">
              <p><strong>Name:</strong> {agentMeta.name}</p>
              <p><strong>URL:</strong>{' '}
                <a href={agentMeta.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                  {agentMeta.url}
                </a>
              </p>
              <p><strong>Description:</strong> {agentMeta.description}</p>
            </div>
          )}

          <SchemaForm agentId={newAgentId} />
        </>
      )}
    </div>
  );
}
