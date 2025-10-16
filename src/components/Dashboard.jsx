import { useState, useEffect } from "react";

function Dashboard({ darkMode, user }) {
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
        setErrorMsg(
          "⚠️ No se pudo conectar al servidor. Revisa tu VPN o Hamachi."
        );
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchDocs();
  }, [user]);

  if (loading)
    return (
      <div
        className={`flex items-center justify-center min-h-screen ${
          darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
        }`}
      >
        <p>Cargando documentos...</p>
      </div>
    );

  return (
    <div
      className={`min-h-screen p-6 ${
        darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">
            Bienvenido, {user?.Nombre || "Usuario"}
          </h1>
        </div>

        <div className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} border rounded-xl shadow-sm overflow-hidden`}>
          <div className={`px-4 py-3 border-b ${darkMode ? "border-gray-700" : "border-gray-200"} flex items-center justify-between`}>
            <h2 className="text-lg font-semibold">📄 Documentos</h2>
            {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className={darkMode ? "bg-gray-700/50" : "bg-gray-100"}>
                <tr>
                  <th className="p-3 text-left font-semibold">Consecutivo</th>
                  <th className="p-3 text-left font-semibold">Número</th>
                  <th className="p-3 text-left font-semibold">Cliente</th>
                  <th className="p-3 text-left font-semibold">Tipo</th>
                  <th className="p-3 text-left font-semibold">Estatus</th>
                  <th className="p-3 text-left font-semibold">Fecha Doc.</th>
                  <th className="p-3 text-left font-semibold">Fecha Entrega</th>
                  <th className="p-3 text-left font-semibold">Días Atraso</th>
                </tr>
              </thead>
              <tbody>
                {documentos.length > 0 ? (
                  documentos.map((doc) => (
                    <tr key={doc.consecutivo} className="border-t border-gray-200 dark:border-gray-700">
                      <td className="p-3">{doc.consecutivo}</td>
                      <td className="p-3">{doc.numeroDocumento}</td>
                      <td className="p-3">{doc.nombreCliente}</td>
                      <td className="p-3">{doc.tipoDocumento}</td>
                      <td className="p-3">{doc.estadoDocumento}</td>
                      <td className="p-3">{doc.fechaDocumento}</td>
                      <td className="p-3">{doc.fechaEntrega}</td>
                      <td className="p-3">{doc.diasAtraso}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center p-6">
                      No hay documentos disponibles.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
