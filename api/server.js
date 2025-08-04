const express = require('express');
const cors = require('cors'); 
const app = express();

// Reemplaza 'chatbotmvv.netlify.app' con el dominio de tu front-end
const corsOptions = {
  origin: 'https://chatbotmvv.netlify.app', 
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions)); 
app.use(express.json());

// Tu endpoint de chat
app.post('/api/chat', (req, res) => {
  // ... tu lógica de chat ...
  res.json({ message: 'Respuesta del servidor' });
});

// Exporta la aplicación para Vercel
module.exports = app;