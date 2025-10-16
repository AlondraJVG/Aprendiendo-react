// Simple proxy server for login and documentos
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/web/login', async (req, res) => {
  try {
    const backendUrl = 'http://25.52.133.193:1414/api/web/Login';
    const backendResponse = await fetch(backendUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });
    const text = await backendResponse.text();
    res.send(text);
  } catch (err) {
    console.error('❌ Error en proxy login:', err);
    res.status(500).send({ Estatus: -1, Descripcion: 'Error de conexión' });
  }
});

app.get('/api/web/documentos', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).send({ Estatus: -1, Descripcion: 'No se envió token' });
    }
    const backendUrl = 'http://25.52.133.193:1451/api/web/documentos';
    const backendResponse = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await backendResponse.json();
    res.json(data);
  } catch (err) {
    console.error('❌ Error en proxy documentos:', err);
    res.status(500).send({
      Estatus: -1,
      Descripcion: 'No se pudo conectar al servidor. Revisa tu VPN o Hamachi.',
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`✅ Proxy corriendo en http://localhost:${PORT}`));
