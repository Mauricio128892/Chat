const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Permitir CORS desde cualquier origen (en desarrollo)
app.use(cors());

// Si prefieres limitarlo (más seguro en producción):
// app.use(cors({
//   origin: ['http://localhost:5173', 'https://tu-frontend-en-netlify.netlify.app']
// }));

app.use(express.json());

app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  console.log("Mensaje recibido:", message);
  
  // Lógica con Gemini o respuesta de prueba
  res.json({ reply: "Hola desde el backend conectado a Gemini" });
});

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
