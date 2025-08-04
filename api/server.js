const express = require('express');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Configura OpenAI
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY || 'AIzaSyAPU6g5Q5fx2jP35S_LV5_pAVQVEokacUA', // pon tu API key aquí o en variable de entorno
});
const openai = new OpenAIApi(configuration);

app.post('/api/chat', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Falta el mensaje' });
  }

  try {
    // Llama a la API de OpenAI
    const completion = await openai.createChatCompletion({
      model: 'gpt-4o-mini', // o 'gpt-4o' o el modelo que uses
      messages: [
        { role: 'system', content: 'Eres un asistente útil.' },
        { role: 'user', content: message }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const reply = completion.data.choices[0].message.content;

    res.json({ reply });
  } catch (error) {
    console.error('Error en OpenAI:', error.response?.data || error.message);
    res.status(500).json({ error: 'Error al comunicarse con OpenAI' });
  }
});

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
