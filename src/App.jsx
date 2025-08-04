import React, { useState, useEffect, useRef } from 'react';
import ChatInterface from './components/ChatInterface';

// Carga el script de Tailwind CSS y Google API directamente desde un CDN
const tailwindScript = document.createElement('script');
tailwindScript.src = 'https://cdn.tailwindcss.com';
document.head.appendChild(tailwindScript);

const googleApiScript = document.createElement('script');
googleApiScript.src = 'https://apis.google.com/js/api.js';
document.head.appendChild(googleApiScript);

// Componente para la pantalla de carga
const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-zinc-900 font-sans">
    <div className="text-center">
      <h1 className="text-5xl font-extrabold text-amber-400 mb-4 animate-pulse">
        Top Mexico Real State
      </h1>
      <p className="text-2xl font-light text-gray-200">
        Cargando la experiencia...
      </p>
      <div className="mt-8 relative w-64 h-1 bg-zinc-600 rounded-full mx-auto overflow-hidden">
        <div className="absolute top-0 left-0 h-full bg-amber-400 animate-loading-bar"></div>
      </div>
      <style>
        {`
        @keyframes loading-bar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-loading-bar {
          animation: loading-bar 2s linear infinite;
        }
        `}
      </style>
    </div>
  </div>
);

// Componente de Dropdown personalizado con animación
const AnimatedDropdown = ({ label, options, selected, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Cierra el dropdown si se hace clic fuera de él
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  const handleSelect = (option) => {
    onSelect(option);
    setIsOpen(false);
  };

  return (
    <div className="flex-1 w-full relative" ref={dropdownRef}>
      <label htmlFor={label} className="block text-sm font-medium mb-1 text-gray-400">{label}</label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 rounded-md bg-zinc-700 border border-gray-600 text-gray-100 placeholder-gray-500 transition-all duration-300 focus:outline-none focus:ring focus:border-amber-400 flex justify-between items-center"
      >
        <span>{selected || `Seleccione un ${label.toLowerCase()}`}</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`lucide lucide-chevron-down transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}><path d="m6 9 6 6 6-6"/></svg>
      </button>
      <div
        className={`absolute z-10 w-full mt-2 bg-zinc-700 rounded-md shadow-lg overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <ul className="py-1 max-h-36 overflow-y-auto">
          {options.map((option, index) => (
            <li
              key={index}
              onClick={() => handleSelect(option)}
              className="px-4 py-2 text-gray-300 hover:bg-zinc-600 hover:text-amber-400 cursor-pointer transition-colors duration-200"
            >
              {option}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// Componente principal de la aplicación
const App = () => {
  const [loading, setLoading] = useState(true);
  const [isChatExpanded, setIsChatExpanded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar la visibilidad del modal principal
  const [selectedProperty, setSelectedProperty] = useState(null); // Nuevo estado para la propiedad seleccionada

  // Estados para los filtros
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedPropertyType, setSelectedPropertyType] = useState('');

  useEffect(() => {
    // Check if backend is ready
    const checkBackendStatus = async () => {
      try {
        const response = await fetch('http://localhost:3001/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: "check_status" }),
        });
        
        if (response.ok || response.status === 500) {
          setLoading(false);
        }
      } catch (error) {
        console.error("Error al conectar con el backend. Reintentando...", error);
        setTimeout(checkBackendStatus, 2000);
      }
    };
    checkBackendStatus();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  // Datos de ejemplo para los filtros y las propiedades
  const locations = ['Cancún', 'Campeche', 'Mérida', 'Yucatán', 'Playa del Carmen'];
  const propertyTypes = ['Departamento', 'Casa', 'Edificio', 'Frente a la Playa', 'Lote Residencial'];
  
  // Datos de ejemplo para las propiedades, ahora con más detalles
  const properties = [
    { 
      id: 1, 
      name: 'Casa en la Playa', 
      description: 'Disfruta del sol y la arena en esta hermosa casa frente al mar, ideal para vacaciones o una vida tranquila. Cuenta con amplios espacios, piscina privada y acceso directo a la playa. La mejor inversión para tu futuro.', 
      images: [
        'https://placehold.co/400x300/E9D8A6/000000?text=Casa+en+la+Playa+1', 
        'https://placehold.co/400x300/E9D8A6/000000?text=Casa+en+la+Playa+2', 
        'https://placehold.co/400x300/E9D8A6/000000?text=Casa+en+la+Playa+3', 
        'https://placehold.co/400x300/E9D8A6/000000?text=Casa+en+la+Playa+4'
      ] 
    },
    { 
      id: 2, 
      name: 'Departamento en el Centro', 
      description: 'Moderno departamento en el corazón de la ciudad. Perfecto para quienes buscan comodidad y acceso a servicios. Cerca de restaurantes, tiendas y transporte público.', 
      images: [
        'https://placehold.co/400x300/a9b9a6/000000?text=Depa+Centro+1', 
        'https://placehold.co/400x300/a9b9a6/000000?text=Depa+Centro+2', 
        'https://placehold.co/400x300/a9b9a6/000000?text=Depa+Centro+3', 
        'https://placehold.co/400x300/a9b9a6/000000?text=Depa+Centro+4'
      ] 
    },
    { 
      id: 3, 
      name: 'Lote Residencial en Tulum', 
      description: 'Oportunidad única para construir la casa de tus sueños en la selva de Tulum. Terreno en un desarrollo exclusivo con seguridad 24/7 y áreas verdes.', 
      images: [
        'https://placehold.co/400x300/404040/ffffff?text=Lote+Tulum+1', 
        'https://placehold.co/400x300/404040/ffffff?text=Lote+Tulum+2', 
        'https://placehold.co/400x300/404040/ffffff?text=Lote+Tulum+3', 
        'https://placehold.co/400x300/404040/ffffff?text=Lote+Tulum+4'
      ] 
    },
    { 
      id: 4, 
      name: 'Villa con Alberca', 
      description: 'Increíble villa con todas las comodidades. Perfecta para el retiro o como inversión para rentas vacacionales. Amplio jardín y alberca privada.', 
      images: [
        'https://placehold.co/400x300/E1A36B/000000?text=Villa+1', 
        'https://placehold.co/400x300/E1A36B/000000?text=Villa+2', 
        'https://placehold.co/400x300/E1A36B/000000?text=Villa+3', 
        'https://placehold.co/400x300/E1A36B/000000?text=Villa+4'
      ] 
    },
    { 
      id: 5, 
      name: 'Casa en Mérida', 
      description: 'Vivienda tradicional yucateca con un toque moderno. Ubicada en una zona tranquila de Mérida, cerca de los mejores servicios y atracciones. Ideal para vivir o como segunda residencia.', 
      images: [
        'https://placehold.co/400x300/B2D8D8/000000?text=Casa+Mérida+1', 
        'https://placehold.co/400x300/B2D8D8/000000?text=Casa+Mérida+2', 
        'https://placehold.co/400x300/B2D8D8/000000?text=Casa+Mérida+3', 
        'https://placehold.co/400x300/B2D8D8/000000?text=Casa+Mérida+4'
      ] 
    },
  ];

  return (
    <div className="relative min-h-screen bg-zinc-900 text-gray-100 font-sans">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-zinc-800 p-4 shadow-md flex items-center justify-between">
        <h1 className="text-2xl font-bold text-amber-400">Top Mexico Real State</h1>
        <div className="flex items-center space-x-4">
          <button className="px-4 py-2 bg-amber-400 text-zinc-900 font-semibold rounded-full hover:bg-amber-300 transition duration-300">
            Iniciar Sesión / Registro
          </button>
        </div>
      </nav>

      {/* Main content, now vertically centered */}
      <main className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8">
        <h2 className="text-4xl font-extrabold text-center text-gray-200">¡Bienvenidos!</h2>
        <p className="text-xl text-center text-gray-400 mt-4">Estamos aquí para ayudarte a encontrar tu hogar ideal en México.</p>
        <div className="mt-8 flex justify-center space-x-4">
          <button 
            onClick={() => setIsModalOpen(true)} // Abre el modal
            className="px-6 py-3 bg-amber-400 text-zinc-900 font-semibold rounded-full hover:bg-amber-300 transition duration-300"
          >
            Ver Propiedades
          </button>
        </div>
      </main>

      {/* Floating Buttons & Chat */}
      <div className="fixed bottom-8 right-8 flex flex-col items-end space-y-4 z-40">
        
        {/* WhatsApp Button */}
        <a 
          href="https://wa.me/5215512345678" // Reemplaza con el número de teléfono real
          target="_blank" 
          rel="noopener noreferrer" 
          className="w-16 h-16 rounded-full bg-green-600 text-white shadow-lg flex items-center justify-center hover:bg-green-500 transition duration-300"
          aria-label="Contactar por WhatsApp"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-whatsapp"><path d="M10.8 19.34c-1.47-1.12-2.8-2.66-3.88-4.22a10.92 10.92 0 0 1-1.38-5.3c-.01-1.44.33-2.83 1.05-4.08.76-1.3 1.93-2.2 3.32-2.58A6.36 6.36 0 0 1 12 3c1.78.01 3.48.74 4.79 2.05s2.05 3.01 2.05 4.79c0 1.44-.33 2.83-1.05 4.08a10.92 10.92 0 0 1-1.38 5.3c-1.08 1.56-2.41 3.1-3.88 4.22a.93.93 0 0 1-.72.28c-.28 0-.54-.12-.72-.3L12 20.89l-1.08-1.55a.93.93 0 0 1-.12-.72ZM10.8 19.34l-1.08 1.55L12 20.89l1.2-1.55a.93.93 0 0 1-.72-.28ZM12 3c1.78.01 3.48.74 4.79 2.05s2.05 3.01 2.05 4.79c0 1.44-.33 2.83-1.05 4.08a10.92 10.92 0 0 1-1.38 5.3c-1.08 1.56-2.41 3.1-3.88 4.22a.93.93 0 0 1-.72.28c-.28 0-.54-.12-.72-.3L12 20.89l-1.08-1.55a.93.93 0 0 1-.12-.72Z" fill="currentColor"/><path d="m15.55 11.23-1.42.74a.42.42 0 0 1-.58-.29l-.27-1.1a.42.42 0 0 0-.4-.36l-1.63.14a.42.42 0 0 0-.37.4l-.27 1.1a.42.42 0 0 1-.58.29l-1.42-.74a.42.42 0 0 0-.59.27L8 13.8a.42.42 0 0 0 .15.53l.74 1.42a.42.42 0 0 1-.29.58l-1.1.27a.42.42 0 0 0-.36.4l.14 1.63a.42.42 0 0 0 .4.37l1.1-.27a.42.42 0 0 1 .58.29l.74 1.42a.42.42 0 0 0 .27.59L12 20a.42.42 0 0 0 .53-.15l1.42-.74a.42.42 0 0 1 .58-.29l1.1.27a.42.42 0 0 0 .4.36l1.63-.14a.42.42 0 0 0 .37-.4l.27-1.1a.42.42 0 0 1 .58-.29l1.42.74a.42.42 0 0 0 .59-.27l1.1-1.92a.42.42 0 0 0-.15-.53l-.74-1.42a.42.42 0 0 1 .29-.58l1.1-.27a.42.42 0 0 0 .36-.4l-.14-1.63a.42.42 0 0 0-.4-.37l-1.1.27a.42.42 0 0 1-.58-.29l-.74-1.42a.42.42 0 0 0-.27-.59Z" fill="currentColor"/></svg>
        </a>

        {/* Chatbot Window */}
        <div className={`
          transform transition-all duration-500 ease-in-out
          ${isChatExpanded ? 'h-96 w-80' : 'h-16 w-80'}
          bg-zinc-800 rounded-xl shadow-2xl overflow-hidden flex flex-col border border-gray-700
        `}>
          {/* Chat minimized bar (always visible) */}
          <div 
            onClick={() => setIsChatExpanded(!isChatExpanded)}
            className={`
              flex-shrink-0 cursor-pointer py-4 px-4 bg-amber-400 text-zinc-900 font-bold flex items-center justify-between
              ${isChatExpanded ? 'rounded-t-xl' : 'rounded-xl'}
            `}
          >
            <span className="flex items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle-code"><path d="M7.9 20A9.9 9.9 0 0 1 12 20c-3.8 0-7.7-2.1-7.7-5.5s3.9-5.5 7.7-5.5 7.7 2.1 7.7 5.5c0 .3 0 .7-.1 1"/><path d="m14 17 2 2 2-2M18 15l2-2 2 2"/></svg>
              <span>Habla con nuestro asistente</span>
            </span>
            {isChatExpanded && (
              <button onClick={(e) => { e.stopPropagation(); setIsChatExpanded(false); }} className="text-zinc-900 hover:text-white transition duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            )}
          </div>
          
          {/* Chat full view (conditionally rendered) */}
          <div className={`flex-1 overflow-y-auto ${isChatExpanded ? 'block' : 'hidden'}`}>
            <ChatInterface />
          </div>
        </div>
      </div>

      {/* Modal de Propiedades */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center backdrop-blur-sm bg-black bg-opacity-75 pt-20">
          <div className="bg-zinc-800 text-gray-100 rounded-xl shadow-2xl overflow-hidden animate-pop max-h-[calc(100vh-8rem)] w-11/12 md:w-3/4 lg:w-2/3 p-6 flex flex-col border border-gray-700">
            
            {/* Header del Modal */}
            <div className="flex justify-between items-center pb-4 border-b border-gray-700">
              <h3 className="text-2xl font-bold text-amber-400">
                {selectedProperty ? selectedProperty.name : 'Propiedades'}
              </h3>
              <button 
                onClick={() => {
                  if (selectedProperty) {
                    setSelectedProperty(null); // Regresa a la lista de propiedades
                  } else {
                    setIsModalOpen(false); // Cierra el modal de la lista
                  }
                }} 
                className="text-gray-400 hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>
            
            {/* Contenido del Modal */}
            <div className="flex-1 overflow-y-auto mt-4 pr-2">
              {selectedProperty ? (
                // Vista de detalle de la propiedad
                <div>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {selectedProperty.images.map((img, index) => (
                      <img 
                        key={index} 
                        src={img} 
                        alt={`${selectedProperty.name} foto ${index + 1}`} 
                        className="rounded-lg w-full h-auto object-cover" 
                      />
                    ))}
                  </div>
                  <p className="text-lg text-gray-300">{selectedProperty.description}</p>
                </div>
              ) : (
                // Vista de la lista de propiedades
                <div>
                  <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 items-end mb-6">
                    
                    {/* Filtro de Ubicación con el nuevo componente */}
                    <AnimatedDropdown 
                      label="Ubicación"
                      options={locations}
                      selected={selectedLocation}
                      onSelect={setSelectedLocation}
                    />

                    {/* Filtro de Precio */}
                    <div className="flex-1 w-full">
                      <label htmlFor="price" className="block text-sm font-medium mb-1 text-gray-400">Precio</label>
                      <input 
                        type="text" 
                        id="price" 
                        placeholder="Ej: 500,000 - 1,000,000"
                        className="w-full px-4 py-2 rounded-md bg-zinc-700 border border-gray-600 text-gray-100 placeholder-gray-500 transition-all duration-300 focus:outline-none focus:ring focus:border-amber-400"
                      />
                    </div>

                    {/* Filtro de Tipo de Propiedad con el nuevo componente */}
                    <AnimatedDropdown 
                      label="Tipo de Propiedad"
                      options={propertyTypes}
                      selected={selectedPropertyType}
                      onSelect={setSelectedPropertyType}
                    />
                    
                    {/* Botón de Búsqueda, ahora con más margen superior en móviles para centrarlo mejor */}
                    <button className="w-full md:w-auto px-6 py-2 bg-amber-400 text-zinc-900 font-semibold rounded-full hover:bg-amber-300 transition duration-300 flex items-center justify-center space-x-2 mt-4 md:mt-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                      <span>Buscar</span>
                    </button>
                  </div>

                  {/* Lista de propiedades */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
                    {properties.map((prop) => (
                      <div 
                        key={prop.id} 
                        className="bg-zinc-700 p-6 rounded-lg shadow-md hover:scale-105 transition duration-300 cursor-pointer"
                        onClick={() => setSelectedProperty(prop)}
                      >
                        <img 
                          src={prop.images[0]} 
                          alt={`Imagen principal de ${prop.name}`} 
                          className="rounded-lg mb-4 w-full h-48 object-cover" 
                        />
                        <p className="text-xl font-bold text-gray-200">{prop.name}</p>
                        <p className="text-sm text-gray-400 mt-2 line-clamp-3">{prop.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Estilos para la animación de pop */}
      <style>
        {`
          @keyframes pop {
            0% {
              transform: scale(0.8);
              opacity: 0;
            }
            100% {
              transform: scale(1);
              opacity: 1;
            }
          }
          .animate-pop {
            animation: pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
          }
        `}
      </style>

    </div>
  );
};

export default App;
