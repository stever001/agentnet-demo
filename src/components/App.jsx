import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // ✅ Required for styles

export default function App() {
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/agent`)
      .then(res => res.json())
      .then(data => setMsg(data.message));
  }, []);

  return (
    <div className="p-6 text-center">
      <h1 className="text-3xl font-bold mb-6">{msg || 'Loading...'}</h1>

      <Link
        to="/dashboard"
        className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Go to Dashboard
      </Link>

      {/* ✅ Toast Notifications */}
      <ToastContainer position="bottom-right" autoClose={4000} />
    </div>
  );
}

