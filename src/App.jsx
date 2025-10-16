import { useEffect, useState } from 'react';
import Auth from './components/Auth.jsx';
import Dashboard from './components/Dashboard.jsx';

function App() {
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

  const toggleDarkMode = () => setDarkMode((v) => !v);

  return (
    <div className={darkMode ? 'bg-gray-900 text-gray-100 min-h-screen' : 'bg-gray-100 text-gray-900 min-h-screen'}>
      {user ? (
        <>
          <div className="flex justify-between items-center p-6">
            <h1 className="text-2xl font-bold">ZENTREGO</h1>
            <div className="flex gap-3">
              <button onClick={toggleDarkMode} className="px-4 py-2 bg-blue-600 text-white rounded-md">
                {darkMode ? '🌞 Claro' : '🌙 Oscuro'}
              </button>
              <button onClick={handleLogout} className="px-4 py-2 bg-red-600 text-white rounded-md">Salir</button>
            </div>
          </div>
          <Dashboard user={user} darkMode={darkMode} />
        </>
      ) : (
        <Auth onLogin={setUser} darkMode={darkMode} />
      )}
    </div>
  );
}

export default App;
