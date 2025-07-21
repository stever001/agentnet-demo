import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/publish', label: 'Publish' },
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/add-schema', label: 'Add Schema' },
  ];

  return (
    <nav className="bg-gray-800 text-white px-4 py-3 shadow">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="text-xl font-semibold tracking-wide">AgentNet</div>
        <div className="flex space-x-4">
          {navItems.map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              className={`px-3 py-2 rounded ${
                location.pathname === path
                  ? 'bg-blue-600'
                  : 'hover:bg-gray-700'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
// Navbar.jsx