// SchemaDetail.jsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function SchemaDetail() {
  const { id } = useParams(); // schemaId
  const [schema, setSchema] = useState(null);
  const [error, setError] = useState('');
  const [updatedJsonLd, setUpdatedJsonLd] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/schemas/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setSchema(data);
        setUpdatedJsonLd(data.jsonLd);
      })
      .catch(() => setError('Error loading schema'));
  }, [id]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/schemas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jsonLd: updatedJsonLd }),
      });
      if (res.ok) {
        const updated = await res.json();
        setSchema(updated);
        alert('Schema updated successfully!');
      } else {
        throw new Error();
      }
    } catch {
      alert('Failed to update schema.');
    } finally {
      setIsSaving(false);
    }
  };

  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!schema) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Schema Detail</h1>
      <p className="mb-2 text-sm text-gray-500">ID: {schema.id}</p>
      {schema.label && <p className="mb-2 font-semibold">Label: {schema.label}</p>}
      <p className="mb-4 text-gray-700">Type: {schema.type}</p>

      <textarea
        className="w-full h-64 p-3 border rounded font-mono text-sm"
        value={updatedJsonLd}
        onChange={(e) => setUpdatedJsonLd(e.target.value)}
      />

      <button
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={handleSave}
        disabled={isSaving}
      >
        {isSaving ? 'Saving...' : 'Save Changes'}
      </button>
    </div>
  );
}
// SchemaDetail.jsx