import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs/promises';
import path from 'path';
import { XMLParser } from 'fast-xml-parser';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { fileURLToPath } from 'url';

const app = express();
const port = 3001;

// Configuración de la API de Gemini
// Se ha cambiado el modelo a gemini-2.5-flash para evitar errores de cuota.
const genAI = new GoogleGenerativeAI('AIzaSyAPU6g5Q5fx2jP35S_LV5_pAVQVEokacUA');
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

app.use(cors());
app.use(bodyParser.json());

let properties = [];

// Función para cargar y parsear el XML de manera asíncrona
const loadProperties = async () => {
  try {
    // Definimos __dirname de manera compatible con ES Modules
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    
    // Usamos path.resolve para obtener una ruta absoluta robusta
    const xmlFilePath = path.resolve(__dirname, '..', 'src', 'data', 'exampleFeed.xml');
    
    // Verificamos si el archivo existe antes de intentar leerlo
    await fs.access(xmlFilePath);
    
    console.log(`Intentando leer el archivo en la ruta: ${xmlFilePath}`);
    
    const xmlData = await fs.readFile(xmlFilePath, 'utf-8');
    const parser = new XMLParser();
    const parsedData = parser.parse(xmlData);
    properties = parsedData.Adverts.Advert;
    console.log("Propiedades cargadas y listas.");
  } catch (error) {
    console.error('Error al cargar o parsear el XML:', error);
    console.log('Asegúrate de que el archivo exampleFeed.xml esté en src/data y que la ruta sea correcta.');
    properties = []; // Aseguramos que la lista esté vacía en caso de error
  }
};

// Cargar las propiedades al iniciar el servidor
loadProperties();

app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;
  
  if (properties.length === 0) {
    res.status(500).json({ error: 'Las propiedades no han sido cargadas aún. Por favor, revisa el log del servidor para más detalles.' });
    return;
  }
  
  // Convertir los datos de las propiedades a una cadena de texto para el prompt
  const propertyDataText = JSON.stringify(properties, null, 2);

  const prompt = `
  Eres un agente de bienes raíces llamado "Top Mexico Real State". Tu trabajo es ayudar a un cliente a encontrar la propiedad de sus sueños.
  Utiliza la siguiente información para responder a las preguntas del cliente. La información está en formato JSON:
  ${propertyDataText}

  El cliente pregunta: "${userMessage}"

  Responde de manera conversacional, amigable y profesional. Si el cliente pregunta por propiedades, usa la información provista para sugerirle opciones. Si la información no contiene datos que el cliente pide, pídele más detalles. No inventes información.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    res.json({ reply: text });
  } catch (error) {
    console.error('Error al llamar a la API de Gemini:', error);
    res.status(500).json({ error: 'Error al obtener respuesta de Gemini.' });
  }
});

app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});
