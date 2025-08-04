// server.js
// Importa las librerías necesarias
const express = require('express');
const cors = require('cors');

// Inicializa la aplicación de Express
const app = express();

// Configuración de CORS
// Es vital que el dominio de 'origin' coincida exactamente con la URL de tu front-end en Netlify.
const corsOptions = {
  // Aquí debes colocar la URL de tu front-end en Netlify
  origin: 'https://chatbotmvv.netlify.app',
  optionsSuccessStatus: 200 // Para navegadores antiguos
};

// Usa el middleware de CORS.
// Esta línea debe estar ANTES de cualquier ruta.
app.use(cors(corsOptions));

// Habilita el análisis de JSON en las peticiones
app.use(express.json());

// Define la ruta principal para el chat.
// En Vercel, esta ruta será accesible en https://[tu-dominio-de-vercel]/api/chat
app.post('/api/chat', (req, res) => {
  console.log('Petición recibida en el servidor:', req.body);
  // Aquí iría tu lógica para procesar la petición y generar la respuesta
  res.status(200).json({ message: 'Respuesta desde el back-end de Vercel' });
});

// Ruta de prueba
app.get('/api/test', (req, res) => {
  res.status(200).send('El back-end está funcionando correctamente.');
});

// ¡CRUCIAL para Vercel!
// Debes exportar la aplicación de Express para que Vercel pueda usarla.
// No uses `app.listen()`, Vercel se encarga de eso.
module.exports = app;
