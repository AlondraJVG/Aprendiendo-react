import { useEffect, useState } from "react";

export default function Dashboard({ darkMode, user }) {
  const [documentos, setDocumentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No hay token");

        const res = await fetch("http://localhost:3001/api/web/documentos", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (data.Estatus === 2 || data.estatus === 2) {
          setDocumentos(data.documentos || []);
        } else {
          setErrorMsg(data.Descripcion || "Error al cargar documentos");
        }
      } catch (err) {
        console.error(err);
        setErrorMsg("⚠️ No se pudo conectar al servidor. Revisa tu VPN o Hamachi.");
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchDocs();
  }, [user]);

  if (loading)
    return (
      <div className={`min-h-dvh grid place-items-center ${darkMode ? "bg-slate-950 text-white" : "bg-white text-slate-900"}`}>
        <p>Cargando documentos...</p>
      </div>
    );

  return (
    <div className={`min-h-dvh p-6 ${darkMode ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"}`}>
      <h1 className="text-2xl font-bold mb-4">Bienvenido, {user?.Nombre || "Usuario"}</h1>

      <h2 className="text-xl font-semibold mb-3">📄 Documentos</h2>
      {errorMsg && <p className="text-rose-500 mb-4">{errorMsg}</p>}

      <div className="overflow-x-auto">
        <table className="min-w-full border border-slate-200 rounded-lg overflow-hidden shadow-sm">
          <thead className={`${darkMode ? "bg-slate-800" : "bg-slate-100"} text-left`}>
            <tr>
              <th className="p-2">Consecutivo</th>
              <th className="p-2">Número</th>
              <th className="p-2">Cliente</th>
              <th className="p-2">Tipo</th>
              <th className="p-2">Estatus</th>
              <th className="p-2">Fecha Doc.</th>
              <th className="p-2">Fecha Entrega</th>
              <th className="p-2">Días Atraso</th>
            </tr>
          </thead>
          <tbody>
            {documentos.length > 0 ? (
              documentos.map((doc) => (
                <tr key={doc.consecutivo} className="border-t border-slate-200">
                  <td className="p-2">{doc.consecutivo}</td>
                  <td className="p-2">{doc.numeroDocumento}</td>
                  <td className="p-2">{doc.nombreCliente}</td>
                  <td className="p-2">{doc.tipoDocumento}</td>
                  <td className="p-2">{doc.estadoDocumento}</td>
                  <td className="p-2">{doc.fechaDocumento}</td>
                  <td className="p-2">{doc.fechaEntrega}</td>
                  <td className="p-2">{doc.diasAtraso}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="text-center p-4">No hay documentos disponibles.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
