import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './components/App';
import Publish from './components/Publish';
import Dashboard from './components/Dashboard';
import AgentDetail from './components/AgentDetail.jsx';
import AddSchema from './components/AddSchema';
import SchemaDetail from './components/SchemaDetail.jsx';
import Navbar from './components/Navbar'; // ✅ Import the new Navbar
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Navbar /> {/* ✅ Show Navbar on all pages */}
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/publish" element={<Publish />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add-schema" element={<AddSchema />} />
        <Route path="/agents/:id" element={<AgentDetail />} />
        <Route path="/schemas/:id" element={<SchemaDetail />} />
        <Route path="*" element={<div className="p-6 text-red-500">404: Page Not Found</div>} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);



