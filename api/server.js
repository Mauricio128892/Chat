const express = require('express');
const cors = require('cors');

const app = express();

// Configuración de CORS
// La URL de origen debe ser la de tu front-end en Netlify.
const corsOptions = {
  origin: 'https://chatbotmvv.netlify.app',
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// Tu ruta de API para el chat
app.post('/api/chat', (req, res) => {
  console.log('Petición recibida en el servidor:', req.body);
  // Aquí iría tu lógica de negocio
  res.status(200).json({ message: 'Respuesta desde el back-end de Vercel' });
});

// Ruta de prueba
app.get('/api/test', (req, res) => {
  res.status(200).send('El back-end está funcionando correctamente.');
});

// CRUCIAL: Exporta la app de Express para que Vercel la pueda ejecutar.
module.exports = app;
