import React, { useState, useEffect } from 'react';

const ContactForm = ({ answers }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [date, setDate] = useState('');
  const [isSignedIntoGoogle, setIsSignedIntoGoogle] = useState(false);

  // Configuración de Google Calendar API (reemplaza con tus credenciales)
  const CLIENT_ID = 'TU_CLIENT_ID.apps.googleusercontent.com';
  const API_KEY = 'TU_API_KEY';
  const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
  const SCOPES = "https://www.googleapis.com/auth/calendar.events";

  // Carga e inicializa la API de Google
  useEffect(() => {
    const loadGapi = async () => {
      try {
        await new Promise(resolve => {
          if (window.gapi) {
            resolve();
          } else {
            window.gapiLoaded = resolve;
          }
        });

        await window.gapi.load('client:auth2', async () => {
          await window.gapi.client.init({
            apiKey: API_KEY,
            clientId: CLIENT_ID,
            discoveryDocs: DISCOVERY_DOCS,
            scope: SCOPES,
          });

          window.gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
          updateSigninStatus(window.gapi.auth2.getAuthInstance().isSignedIn.get());
        });
      } catch (error) {
        console.error("Error al cargar o inicializar la API de Google:", error);
      }
    };
    
    const updateSigninStatus = (isSignedIn) => {
      setIsSignedIntoGoogle(isSignedIn);
    };

    loadGapi();
  }, []);

  const handleCreateEvent = async () => {
    if (!isSignedIntoGoogle) {
      alert('Debes iniciar sesión con Google para agendar una cita.');
      return;
    }

    if (!name || !email || !date) {
      alert('Por favor, completa todos los campos para agendar la cita.');
      return;
    }

    const event = {
      'summary': `Cita para ver propiedades con ${name}`,
      'description': `Contacto: ${email}\nFiltros de búsqueda:\n- Tipo: ${answers.tipo}\n- Zona: ${answers.zona}\n- Precio: ${answers.precio}`,
      'start': {
        'dateTime': new Date(date).toISOString(),
        'timeZone': 'America/Mexico_City',
      },
      'end': {
        'dateTime': new Date(new Date(date).getTime() + 60 * 60 * 1000).toISOString(),
        'timeZone': 'America/Mexico_City',
      },
    };

    try {
      await window.gapi.client.calendar.events.insert({
        'calendarId': 'primary',
        'resource': event,
      });
      alert('¡Cita agendada con éxito!');
    } catch (error) {
      console.error("Error al crear el evento:", error);
      alert('Hubo un error al agendar la cita. Revisa la consola para más detalles.');
    }
  };

  const waMessage = `Hola, me gustaría agendar una cita para ver propiedades. Mis criterios de búsqueda son: Tipo: ${answers.tipo}, Zona: ${answers.zona}, Precio: ${answers.precio}.`;
  const whatsappLink = `https://wa.me/5219981234567?text=${encodeURIComponent(waMessage)}`;

  return (
    <div className="flex flex-col items-center mt-6 p-4 bg-zinc-900 rounded-lg shadow-inner w-full border border-gray-700">
      <h3 className="text-2xl font-bold mb-4 text-amber-400">Agendar una Cita</h3>
      <p className="text-center text-sm text-gray-400 mb-4">¡Contacta a un agente o agenda directamente en Google Calendar!</p>
      <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="w-full mb-4">
        <button className="w-full py-3 px-6 bg-green-600 hover:bg-green-500 text-gray-100 font-bold rounded-full shadow-md transition duration-300 transform hover:scale-105 flex items-center justify-center space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-whatsapp"><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle><path d="M22 16.92A4.2 4.2 0 0 0 18.24 13.7l-2.45-2.45a6.83 6.83 0 0 0-1.81-1.48c-.96-.4-2-.1-2.91.4-1.2.65-2.22 1.95-2.82 3.42-.6 1.46-.86 3.19-.77 4.95.07 1.25.43 2.45.92 3.5.49 1.05 1.15 2 1.95 2.82s1.82 1.46 2.82 1.95c1.05.49 2.25.85 3.5.92 1.76.09 3.49-.17 4.95-.77 1.47-.6 2.77-1.62 3.42-2.82.5-.91.8-2 .4-2.91s-.81-1.81-1.48-2.45l-2.45-2.45z"></path></svg>
          <span>Contactar por WhatsApp</span>
        </button>
      </a>
      <div className="border-t border-gray-700 w-full my-4"></div>
      <div className="w-full flex flex-col space-y-3">
        <input
          type="text"
          placeholder="Tu Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="p-3 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400 bg-zinc-800 text-gray-100 placeholder-gray-500"
        />
        <input
          type="email"
          placeholder="Tu Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-3 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400 bg-zinc-800 text-gray-100 placeholder-gray-500"
        />
        <input
          type="datetime-local"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="p-3 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400 bg-zinc-800 text-gray-100 placeholder-gray-500"
        />
      </div>
      <button
        onClick={handleCreateEvent}
        className="w-full mt-4 py-3 px-6 bg-amber-400 hover:bg-amber-300 text-zinc-900 font-bold rounded-full shadow-md transition duration-300 transform hover:scale-105"
      >
        {isSignedIntoGoogle ? 'Agendar en Google Calendar' : 'Iniciar sesión en Google'}
      </button>
    </div>
  );
};

export default ContactForm;
