// Publish.jsx
import { useState } from 'react';

export default function Publish() {
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    description: ''
  });

  const [submitted, setSubmitted] = useState(false);

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
      setSubmitted(true);
      setFormData({ name: '', url: '', description: '' });
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Publish a New Agent</h2>
      {submitted && <p style={{ color: 'green' }}>Agent published successfully!</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Agent Name:
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </label>
        <br /><br />
        <label>
          Site URL:
          <input type="url" name="url" value={formData.url} onChange={handleChange} required />
        </label>
        <br /><br />
        <label>
          Description:
          <textarea name="description" value={formData.description} onChange={handleChange} required />
        </label>
        <br /><br />
        <button type="submit">Publish Agent</button>
      </form>
    </div>
  );
}
