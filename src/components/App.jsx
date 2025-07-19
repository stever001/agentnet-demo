import { useEffect, useState } from 'react';

export default function App() {
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/agent`)
      .then(res => res.json())
      .then(data => setMsg(data.message));
  }, []);

  return <h1>{msg || 'Loading...'}</h1>;
}
