import React from 'react';
import PropertyCard from './PropertyCard';
import ContactForm from './ContactForm';

const Chatbot = ({ step, answers, filteredProperties, handleAnswer, resetChatbot }) => {
  // Definición de las preguntas y opciones del chatbot
  const questions = [
    { key: 'tipo', text: '¿Qué tipo de propiedad buscas?', options: ['Casa', 'Departamento', 'Terreno'] },
    { key: 'zona', text: '¿En qué zona?', options: ['Cancún', 'Playa del Carmen', 'Tulum'] },
    { key: 'precio', text: '¿Cuál es tu presupuesto?', options: ['< $1M', '$1M - $3M', '> $3M'] },
  ];

  const currentQuestion = questions[step];

  return (
    <div className="flex flex-col h-full bg-zinc-900 p-6 rounded-lg shadow-inner">
      <div className="flex-1 overflow-y-auto pr-2">
        {/* Bienvenida */}
        {step === 0 && (
          <div className="mb-4 p-4 bg-amber-400 text-zinc-900 rounded-lg max-w-sm">
            <p className="font-bold">Hola, bienvenido al chatbot de Top Mexico Real State. Estoy aquí para ayudarte a encontrar la propiedad de tus sueños. 😉</p>
          </div>
        )}

        {/* Muestra las respuestas del usuario */}
        {questions.slice(0, step).map((q, index) => (
          <div key={q.key} className="flex flex-col items-start mb-4">
            <div className="p-3 mb-2 bg-zinc-700 text-gray-100 rounded-lg self-start max-w-xs">
              <p>{q.text}</p>
            </div>
            <div className="p-3 bg-amber-400 text-zinc-900 rounded-lg self-end max-w-xs">
              <p className="font-bold">{answers[q.key]}</p>
            </div>
          </div>
        ))}

        {/* Muestra la pregunta actual y sus opciones */}
        {currentQuestion && (
          <div className="p-3 bg-zinc-700 text-gray-100 rounded-lg mb-4 max-w-sm">
            <p>{currentQuestion.text}</p>
          </div>
        )}
      </div>

      {/* Muestra las opciones o el resumen final */}
      <div className="mt-4 pt-4 border-t border-gray-700 flex flex-wrap justify-center gap-2">
        {currentQuestion ? (
          currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(currentQuestion.key, option)}
              className="bg-zinc-800 text-amber-400 border border-amber-400 rounded-full px-4 py-2 font-semibold hover:bg-amber-400 hover:text-zinc-900 transition duration-300"
            >
              {option}
            </button>
          ))
        ) : (
          <div className="w-full">
            <h3 className="text-xl font-bold mb-4 text-center text-amber-400">Resultados de tu búsqueda:</h3>
            <p className="text-center text-sm text-gray-400 mb-4">
              Encontramos <span className="font-bold">{filteredProperties.length}</span> propiedades que coinciden con tus criterios:
            </p>
            <div className="flex flex-col items-center">
              {filteredProperties.length > 0 ? (
                filteredProperties.map(prop => <PropertyCard key={prop.id} property={prop} />)
              ) : (
                <p className="text-center text-gray-500 italic">No se encontraron propiedades que coincidan con tu búsqueda. Intenta de nuevo.</p>
              )}
              <ContactForm answers={answers} />
              <button
                onClick={resetChatbot}
                className="mt-6 py-2 px-6 bg-zinc-700 hover:bg-zinc-600 text-gray-100 font-bold rounded-full transition duration-300"
              >
                Volver a empezar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chatbot;
