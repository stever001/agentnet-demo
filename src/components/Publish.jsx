import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Publish = () => {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [techContactEmail, setTechContactEmail] = useState('');
  const [billingContactEmail, setBillingContactEmail] = useState('');

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    if (!name || !url || !description) {
      setError('Name, URL, and description are required.');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          url,
          description,
          ownerName,
          ownerEmail,
          organization,
          techContactEmail,
          billingContactEmail,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to publish agent.');
      } else {
        navigate(`/agents/${data.id}`);
      }
    } catch (err) {
      console.error(err);
      setError('Unexpected error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Publish a New Agent</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-500">{error}</p>}

        <div>
          <label className="block mb-1 font-medium">Agent Name</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded p-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. MarketBot"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Target URL</label>
          <input
            type="url"
            className="w-full border border-gray-300 rounded p-2"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            className="w-full border border-gray-300 rounded p-2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What does this agent do?"
            required
          />
        </div>

        <hr className="my-4" />
        <h3 className="text-lg font-medium">Agent Profile Information</h3>

        <div>
          <label className="block mb-1 font-medium">Owner Name</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded p-2"
            value={ownerName}
            onChange={(e) => setOwnerName(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Owner Email</label>
          <input
            type="email"
            className="w-full border border-gray-300 rounded p-2"
            value={ownerEmail}
            onChange={(e) => setOwnerEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Organization</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded p-2"
            value={organization}
            onChange={(e) => setOrganization(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Tech Contact Email</label>
          <input
            type="email"
            className="w-full border border-gray-300 rounded p-2"
            value={techContactEmail}
            onChange={(e) => setTechContactEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Billing Contact Email</label>
          <input
            type="email"
            className="w-full border border-gray-300 rounded p-2"
            value={billingContactEmail}
            onChange={(e) => setBillingContactEmail(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Publishing...' : 'Publish Agent'}
        </button>
      </form>
    </div>
  );
};

export default Publish;
