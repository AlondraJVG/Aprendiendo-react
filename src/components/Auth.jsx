import { useState, useEffect } from "react";

export default function Auth({ onLogin, darkMode }) {
  const [loading, setLoading] = useState(true);
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [loginMsg, setLoginMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
        body: JSON.stringify({ usuario, contraseña: password }),
      });

      const data = await res.json();
      if (data.Estatus === "2" || data.estatus === 2) {
        localStorage.setItem("token", data.Token);
        localStorage.setItem("user", JSON.stringify(data));
        setLoginMsg("✅ Bienvenido " + (data.Nombre ?? ""));
        onLogin?.(data);
      } else {
        setLoginMsg("❌ " + (data.Descripcion || "Error de autenticación."));
      }
    } catch (error) {
      console.error("⚠️ Error en el login:", error);
      setLoginMsg("⚠️ No se pudo conectar con el servidor.");
    }
  };

  if (loading)
    return (
      <div className={`min-h-dvh grid place-items-center ${darkMode ? "bg-slate-950" : "bg-white"}`}>
        <img src="/vite.svg" alt="ZENTREGO" className="w-32 h-32 animate-pulse opacity-80" />
      </div>
    );

  return (
    <div className={`min-h-dvh grid place-items-center px-4 ${darkMode ? "bg-slate-950 text-slate-100" : "bg-gradient-to-br from-indigo-50 via-sky-50 to-white text-slate-900"}`}>
      <div className="w-full max-w-md">
        <div className="card-glass rounded-2xl p-8">
          <div className="flex flex-col items-center mb-6">
            <img src="/vite.svg" alt="ZENTREGO" className="w-16 h-16 drop-shadow" />
            <h1 className="mt-3 text-2xl font-bold tracking-tight">ZENTREGO</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Accede a tu cuenta</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Correo electrónico</label>
              <input
                type="email"
                placeholder="correo@empresa.com"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                className={`w-full px-3 py-2 rounded-xl border ${darkMode ? "bg-slate-800 border-slate-700 text-slate-100" : "bg-white border-slate-200 text-slate-900"} input-focus`}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Contraseña</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full px-3 py-2 pr-10 rounded-xl border ${darkMode ? "bg-slate-800 border-slate-700 text-slate-100" : "bg-white border-slate-200 text-slate-900"} input-focus`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-2 my-auto px-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {loginMsg && (
              <p className={`text-sm text-center ${loginMsg.startsWith("✅") ? "text-emerald-600" : "text-rose-600"}`}>
                {loginMsg}
              </p>
            )}

            <button type="submit" className="btn-primary w-full py-2.5">
              Ingresar
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} ZENTREGO. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
}
