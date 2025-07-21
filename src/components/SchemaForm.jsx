import { useState } from 'react';
import axios from 'axios';

export default function SchemaForm({ agentId }) {
  const [label, setLabel] = useState('');
  const [jsonLd, setJsonLd] = useState('');
  const [message, setMessage] = useState(null);

  const handleSubmit = async () => {
    try {
      const parsed = JSON.parse(jsonLd);
      const type = parsed['@type'] || 'Thing';

      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/schemas`, {
        agentId,
        type,
        jsonLd,
        label,
      });

      setMessage({ type: 'success', text: 'Schema saved successfully.' });
      setLabel('');
      setJsonLd('');
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Invalid JSON or API error' });
    }
  };

  return (
    <div className="p-6 border border-gray-300 rounded-md bg-white shadow-md">
      <div className="space-y-4">
        {message && (
          <div
            className={`p-3 rounded text-sm ${
              message.type === 'success'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {message.text}
          </div>
        )}

        <div>
          <label className="block font-medium mb-1">Schema Label (optional)</label>
          <input
            type="text"
            className="w-full border border-gray-300 p-2 rounded"
            placeholder="e.g., Homepage Schema"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
        </div>

        <div>
          <label className="block font-medium mb-1">JSON-LD</label>
          <textarea
            className="w-full border border-gray-300 p-2 rounded"
            placeholder="Paste JSON-LD here..."
            rows={10}
            value={jsonLd}
            onChange={(e) => setJsonLd(e.target.value)}
          />
        </div>

        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit Schema
        </button>
      </div>
    </div>
  );
}
