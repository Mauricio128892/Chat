export default async function handler(req, res) {
  // Habilitar CORS manualmente
  res.setHeader('Access-Control-Allow-Origin', '*'); // Cambia * por tu dominio si lo necesitas
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end(); // Preflight response
    return;
  }

  if (req.method === 'POST') {
    const body = req.body;
    console.log('Petición recibida:', body);

    // Aquí podrías procesar con Gemini
    return res.status(200).json({ message: 'Respuesta desde función serverless' });
  }

  res.status(405).json({ error: 'Método no permitido' });
}
