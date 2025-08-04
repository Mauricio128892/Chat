// server.js
const express = require('express');
const cors = require('cors'); // Asegúrate de que esta línea esté presente
const app = express();

// Configuración de CORS
// Esto permite que el front-end en Netlify acceda a tu API.
// Es crucial que el dominio sea exactamente el de tu front-end.
const corsOptions = {
  origin: 'https://chatbotmvv.netlify.app',
  optionsSuccessStatus: 200 // Para navegadores antiguos
};

// Usa el middleware de CORS. Es vital que esto esté al principio,
// antes de que definas cualquier ruta.
app.use(cors(corsOptions));
app.use(express.json());

// Tu ruta para el chat
app.post('/api/chat', (req, res) => {
  // Tu lógica de chat
  // console.log('Petición recibida:', req.body);
  res.json({ message: 'Respuesta del servidor' });
});

// Importante para Vercel:
// Vercel no usa app.listen, así que necesitas exportar tu app de Express.
module.exports = app;