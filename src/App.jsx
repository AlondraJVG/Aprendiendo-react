import { useEffect, useState } from 'react';
import './index.css';
import Auth from './components/Auth.jsx';
import Dashboard from './components/Dashboard.jsx';

export default function App() {
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className={darkMode ? 'bg-slate-950 text-slate-100 min-h-dvh' : 'bg-slate-50 text-slate-900 min-h-dvh'}>
        <div className="p-4 flex justify-end gap-3">
          <button
            onClick={() => setDarkMode((v) => !v)}
            className="px-3 py-1.5 rounded-lg border border-slate-300/60 bg-white/70 dark:bg-slate-800 dark:border-slate-700 shadow-sm"
            aria-label="Cambiar tema"
          >
            {darkMode ? '🌞 Claro' : '🌙 Oscuro'}
          </button>
          {user && (
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-lg bg-rose-500 text-white shadow hover:bg-rose-600"
            >
              Salir
            </button>
          )}
        </div>

        {user ? (
          <Dashboard user={user} darkMode={darkMode} />
        ) : (
          <Auth onLogin={setUser} darkMode={darkMode} />
        )}
      </div>
    </div>
  );
}
