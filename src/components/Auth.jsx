import { useState, useEffect } from "react";

function Auth({ onLogin, darkMode }) {
  const [loading, setLoading] = useState(true);
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginMsg, setLoginMsg] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginMsg("");

    try {
      const res = await fetch("http://localhost:3001/api/web/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usuario,
          contraseña: password,
        }),
      });

      const data = await res.json();
      if (data.Estatus === "2" || data.estatus === 2) {
        localStorage.setItem("token", data.Token);
        localStorage.setItem("user", JSON.stringify(data));
        setLoginMsg("✅ Bienvenido " + (data.Nombre || ""));
        if (onLogin) onLogin(data);
      } else {
        setLoginMsg("❌ " + (data.Descripcion || "Error de autenticación."));
      }
    } catch (error) {
      console.error("⚠️ Error en el login:", error);
      setLoginMsg("⚠️ No se pudo conectar con el servidor.");
    }
  };

  const bgClass = darkMode
    ? "bg-gradient-to-br from-gray-900 via-gray-900 to-black text-gray-100"
    : "bg-gradient-to-br from-slate-50 via-white to-sky-50 text-gray-900";

  if (loading)
    return (
      <div className={`flex items-center justify-center min-h-screen ${bgClass}`}>
        <div className="flex flex-col items-center gap-4">
          <img
            src="/assets/logo.png"
            alt="Logo"
            className="w-24 h-24 opacity-90"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/vite.svg";
            }}
          />
          <div className="h-2 w-52 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
            <div className="h-full w-1/3 animate-[loading_1.2s_infinite] rounded-full bg-blue-500" />
          </div>
        </div>
      </div>
    );

  return (
    <div className={`min-h-screen ${bgClass} flex items-center justify-center px-4 py-10`}>
      <div
        className={`relative w-full max-w-md rounded-2xl border shadow-xl ${
          darkMode ? "bg-gray-900/70 border-gray-800" : "bg-white/70 border-sky-100"
        } backdrop-blur-md p-8`}
      >
        <div className="flex flex-col items-center text-center">
          <img
            src="/assets/logo.png"
            alt="Logo"
            className="w-20 mb-3"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/vite.svg";
            }}
          />
          <h1 className="text-2xl font-bold tracking-tight">ZENTREGO</h1>
          <p className="text-sm opacity-80 mt-1">Inicia sesión para continuar</p>
        </div>

        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Correo electrónico</label>
            <div
              className={`flex items-center rounded-lg border px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500 ${
                darkMode
                  ? "bg-gray-800/60 border-gray-700"
                  : "bg-white/80 border-gray-200"
              }`}
            >
              <span className="mr-2 opacity-70">📧</span>
              <input
                type="email"
                placeholder="tu@correo.com"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                className={`w-full bg-transparent outline-none placeholder:opacity-60 ${
                  darkMode ? "text-gray-100" : "text-gray-900"
                }`}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Contraseña</label>
            <div
              className={`flex items-center rounded-lg border px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500 ${
                darkMode
                  ? "bg-gray-800/60 border-gray-700"
                  : "bg-white/80 border-gray-200"
              }`}
            >
              <span className="mr-2 opacity-70">🔒</span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full bg-transparent outline-none placeholder:opacity-60 ${
                  darkMode ? "text-gray-100" : "text-gray-900"
                }`}
                required
              />
              <button
                type="button"
                className="ml-2 text-xs opacity-70 hover:opacity-100"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? "Ocultar" : "Mostrar"}
              </button>
            </div>
          </div>

          {loginMsg && (
            <p className={`text-sm text-center ${loginMsg.startsWith("✅") ? "text-green-600" : "text-red-600"}`}>
              {loginMsg}
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 text-white py-2.5 font-medium shadow hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
          >
            Ingresar
          </button>
        </form>

        <div className="mt-6 text-center text-xs opacity-70">
          <p>© {new Date().getFullYear()} ZENTREGO</p>
        </div>
      </div>

      <style>
        {`@keyframes loading { 0% { transform: translateX(-100%);} 50% { transform: translateX(100%);} 100% { transform: translateX(300%);} }`}
      </style>
    </div>
  );
}

export default Auth;
