import React, { useState, useEffect, useRef } from 'react';
import ChatInterface from './components/ChatInterface';

// Carga scripts de Tailwind y Google API (igual que en tu original)
const tailwindScript = document.createElement('script');
tailwindScript.src = 'https://cdn.tailwindcss.com';
document.head.appendChild(tailwindScript);

const googleApiScript = document.createElement('script');
googleApiScript.src = 'https://apis.google.com/js/api.js';
document.head.appendChild(googleApiScript);

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
      <style>{`
        @keyframes loading-bar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-loading-bar {
          animation: loading-bar 2s linear infinite;
        }
      `}</style>
    </div>
  </div>
);

const AnimatedDropdown = ({ label, options, selected, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleSelect = (option) => {
    onSelect(option);
    setIsOpen(false);
  };

  return (
    <div className="flex-1 w-full relative" ref={dropdownRef}>
      <label htmlFor={label} className="block text-sm font-medium mb-1 text-gray-400">
        {label}
      </label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 rounded-md bg-zinc-700 border border-gray-600 text-gray-100 placeholder-gray-500 transition-all duration-300 focus:outline-none focus:ring focus:border-amber-400 flex justify-between items-center"
      >
        <span>{selected || `Seleccione un ${label.toLowerCase()}`}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`lucide lucide-chevron-down transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      <div
        className={`absolute z-10 w-full mt-2 bg-zinc-700 rounded-md shadow-lg overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
        }`}
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

const App = () => {
  const [loading, setLoading] = useState(true);
  const [isChatExpanded, setIsChatExpanded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);

  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedPropertyType, setSelectedPropertyType] = useState('');

  useEffect(() => {
    const checkBackendStatus = async () => {
      try {
        const response = await fetch('https://mam-33cu.onrender.com/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: 'Hola' }),
        });
        if (response.ok || response.status === 500) {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error al conectar con el backend. Reintentando...', error);
        setTimeout(checkBackendStatus, 2000);
      }
    };
    checkBackendStatus();
  }, []);

  if (loading) return <LoadingScreen />;

  const locations = ['Cancún', 'Campeche', 'Mérida', 'Yucatán', 'Playa del Carmen'];
  const propertyTypes = ['Departamento', 'Casa', 'Edificio', 'Frente a la Playa', 'Lote Residencial'];
  const properties = [
    {
      id: 1,
      name: 'Casa en la Playa',
      description:
        'Disfruta del sol y la arena en esta hermosa casa frente al mar, ideal para vacaciones o una vida tranquila. Cuenta con amplios espacios, piscina privada y acceso directo a la playa. La mejor inversión para tu futuro.',
      images: [
        'https://placehold.co/400x300/E9D8A6/000000?text=Casa+en+la+Playa+1',
        'https://placehold.co/400x300/E9D8A6/000000?text=Casa+en+la+Playa+2',
        'https://placehold.co/400x300/E9D8A6/000000?text=Casa+en+la+Playa+3',
        'https://placehold.co/400x300/E9D8A6/000000?text=Casa+en+la+Playa+4',
      ],
    },
    {
      id: 2,
      name: 'Departamento en el Centro',
      description:
        'Moderno departamento en el corazón de la ciudad. Perfecto para quienes buscan comodidad y acceso a servicios. Cerca de restaurantes, tiendas y transporte público.',
      images: [
        'https://placehold.co/400x300/a9b9a6/000000?text=Depa+Centro+1',
        'https://placehold.co/400x300/a9b9a6/000000?text=Depa+Centro+2',
        'https://placehold.co/400x300/a9b9a6/000000?text=Depa+Centro+3',
        'https://placehold.co/400x300/a9b9a6/000000?text=Depa+Centro+4',
      ],
    },
    {
      id: 3,
      name: 'Lote Residencial en Tulum',
      description:
        'Oportunidad única para construir la casa de tus sueños en la selva de Tulum. Terreno en un desarrollo exclusivo con seguridad 24/7 y áreas verdes.',
      images: [
        'https://placehold.co/400x300/404040/ffffff?text=Lote+Tulum+1',
        'https://placehold.co/400x300/404040/ffffff?text=Lote+Tulum+2',
        'https://placehold.co/400x300/404040/ffffff?text=Lote+Tulum+3',
        'https://placehold.co/400x300/404040/ffffff?text=Lote+Tulum+4',
      ],
    },
    {
      id: 4,
      name: 'Villa con Alberca',
      description:
        'Increíble villa con todas las comodidades. Perfecta para el retiro o como inversión para rentas vacacionales. Amplio jardín y alberca privada.',
      images: [
        'https://placehold.co/400x300/E1A36B/000000?text=Villa+1',
        'https://placehold.co/400x300/E1A36B/000000?text=Villa+2',
        'https://placehold.co/400x300/E1A36B/000000?text=Villa+3',
        'https://placehold.co/400x300/E1A36B/000000?text=Villa+4',
      ],
    },
    {
      id: 5,
      name: 'Casa en Mérida',
      description:
        'Vivienda tradicional yucateca con un toque moderno. Ubicada en una zona tranquila de Mérida, cerca de los mejores servicios y atracciones. Ideal para vivir o como segunda residencia.',
      images: [
        'https://placehold.co/400x300/B2D8D8/000000?text=Casa+Mérida+1',
        'https://placehold.co/400x300/B2D8D8/000000?text=Casa+Mérida+2',
        'https://placehold.co/400x300/B2D8D8/000000?text=Casa+Mérida+3',
        'https://placehold.co/400x300/B2D8D8/000000?text=Casa+Mérida+4',
      ],
    },
  ];

  return (
    <div className="relative min-h-screen bg-zinc-900 text-gray-100 font-sans">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-zinc-800 p-4 shadow-md flex items-center justify-between">
        <h1 className="text-2xl font-bold text-amber-400">Top Mexico Real State</h1>
        <div className="flex items-center space-x-4">
          <button className="px-4 py-2 bg-amber-400 text-zinc-900 font-semibold rounded-full hover:bg-amber-300 transition duration-300">
            Iniciar Sesión / Registro
          </button>
        </div>
      </nav>

      <main className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8">
        <h2 className="text-4xl font-extrabold text-center text-gray-200">¡Bienvenidos!</h2>
        <p className="text-xl text-center text-gray-400 mt-4">Estamos aquí para ayudarte a encontrar tu hogar ideal en México.</p>
        <div className="mt-8 flex justify-center space-x-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 bg-amber-400 text-zinc-900 font-semibold rounded-full hover:bg-amber-300 transition duration-300"
          >
            Ver Propiedades
          </button>
        </div>
      </main>

      <div className="fixed bottom-8 right-8 flex flex-col items-end space-y-4 z-40">
        <a
          href="https://wa.me/5215512345678"
          target="_blank"
          rel="noopener noreferrer"
          className="w-16 h-16 rounded-full bg-green-600 text-white shadow-lg flex items-center justify-center hover:bg-green-500 transition duration-300"
          aria-label="Contactar por WhatsApp"
        >
          {/* Icono de WhatsApp */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-whatsapp"
          >
            <path d="M10.8 19.34c-1.47-1.12-2.8-2.66-3.88-4.22a10.92 10.92 0 0 1-1.38-5.3c-.01-1.44.33-2.83 1.05-4.08.76-1.3 1.93-2.2 3.32-2.58A6.36 6.36 0 0 1 12 3c1.78.01 3.48.74 4.79 2.05s2.05 3.01 2.05 4.79c0 1.44-.33 2.83-1.05 4.08a10.92 10.92 0 0 1-1.38 5.3c-1.08 1.56-2.41 3.1-3.88 4.22a.93.93 0 0 1-.72.28c-.28 0-.54-.12-.72-.3L12 20.89l-1.08-1.55a.93.93 0 0 1-.12-.72ZM10.8 19.34l-1.08 1.55L12 20.89l1.2-1.55a.93.93 0 0 1-.72-.28ZM12 3c1.78.01 3.48.74 4.79 2.05s2.05 3.01 2.05 4.79c0 1.44-.33 2.83-1.05 4.08a10.92 10.92 0 0 1-1.38 5.3c-1.08 1.56-2.41 3.1-3.88 4.22a.93.93 0 0 1-.72.28c-.28 0-.54-.12-.72-.3L12 20.89l-1.08-1.55a.93.93 0 0 1-.12-.72Z" fill="currentColor" />
            <path d="m15.55 11.23-1.42.74a.42.42 0 0 1-.58-.29l-.27-1.1a.42.42 0 0 0-.4-.36l-1.63.14a.42.42 0 0 0-.37.4l-.27 1.1a.42.42 0 0 1-.58.29l-1.42-.74a.42.42 0 0 0-.59.27L8 13.8a.42.42 0 0 0 .15.53l.74 1.42a.42.42 0 0 1-.29.58l-1.1.27a.42.42 0 0 0-.36.4l.14 1.63a.42.42 0 0 0 .4.37l1.1-.27a.42.42 0 0 1 .58.29l.74 1.42a.42.42 0 0 0 .27.59L12 20a.42.42 0 0 0 .53-.15l1.42-.74a.42.42 0 0 1 .58-.29l1.1.27a.42.42 0 0 0 .4.36l1.63-.14a.42.42 0 0 0 .37-.4l.27-1.1a.42.42 0 0 1 .58-.29l1.42.74a.42.42 0 0 0 .59-.27l1.1-1.92a.42.42 0 0 0-.15-.53l-.74-1.42a.42.42 0 0 1 .29-.58l1.1-.27a.42.42 0 0 0 .36-.4l-.14-1.63a.42.42 0 0 0-.4-.37l-1.1.27a.42.42 0 0 1-.58-.29l-.74-1.42a.42.42 0 0 0-.27-.59L12 8a.42.42 0 0 0-.53.15Z" fill="currentColor" />
          </svg>
        </a>

        <button
          onClick={() => setIsChatExpanded(!isChatExpanded)}
          className="w-16 h-16 rounded-full bg-amber-400 text-zinc-900 shadow-lg flex items-center justify-center hover:bg-amber-300 transition duration-300"
          aria-label="Abrir chat"
        >
          {isChatExpanded ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-x"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-message-square"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          )}
        </button>
      </div>

      {isChatExpanded && (
        <div className="fixed bottom-24 right-8 z-50 w-80 max-w-full h-[480px] rounded-xl shadow-lg bg-zinc-900 border border-amber-400 overflow-hidden flex flex-col">
          <ChatInterface
            apiEndpoint="https://mam-33cu.onrender.com/api/chat"
            onClose={() => setIsChatExpanded(false)}
          />
        </div>
      )}

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-zinc-800 rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold text-amber-400 mb-4">Explora propiedades</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <AnimatedDropdown
                label="Localización"
                options={locations}
                selected={selectedLocation}
                onSelect={setSelectedLocation}
              />
              <AnimatedDropdown
                label="Tipo de propiedad"
                options={propertyTypes}
                selected={selectedPropertyType}
                onSelect={setSelectedPropertyType}
              />
            </div>

            <div className="mt-6 space-y-6">
              {properties
                .filter(
                  (p) =>
                    (!selectedLocation || p.name.toLowerCase().includes(selectedLocation.toLowerCase())) &&
                    (!selectedPropertyType || p.name.toLowerCase().includes(selectedPropertyType.toLowerCase()))
                )
                .map((property) => (
                  <div
                    key={property.id}
                    className="bg-zinc-700 rounded-lg p-4 cursor-pointer hover:bg-zinc-600 transition-colors"
                    onClick={() => {
                      setSelectedProperty(property);
                      setIsModalOpen(false);
                    }}
                  >
                    <h4 className="text-lg font-semibold text-amber-400">{property.name}</h4>
                    <p className="text-gray-300 line-clamp-3">{property.description}</p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {selectedProperty && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-60 flex flex-col justify-center items-center p-4 overflow-auto"
          onClick={() => setSelectedProperty(null)}
        >
          <div
            className="bg-zinc-900 rounded-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-3xl font-bold text-amber-400 mb-4">{selectedProperty.name}</h3>
            <p className="mb-6 text-gray-300">{selectedProperty.description}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {selectedProperty.images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`${selectedProperty.name} imagen ${i + 1}`}
                  className="rounded-md object-cover w-full h-48"
                  loading="lazy"
                />
              ))}
            </div>
            <button
              className="mt-6 px-6 py-3 bg-amber-400 text-zinc-900 rounded-full hover:bg-amber-300 transition duration-300"
              onClick={() => setSelectedProperty(null)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
