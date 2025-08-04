import React, { useState } from "react";

function App() {
  const [response, setResponse] = useState("");

  const enviarMensaje = async () => {
    try {
      const res = await fetch("https://mam-33cu.onrender.com/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "Hola desde React" }),
      });

      if (!res.ok) throw new Error("Error en la respuesta del servidor");

      const data = await res.json();
      setResponse(data.reply);
    } catch (error) {
      console.error("Error al conectar con backend:", error);
      setResponse("Error al conectar con backend");
    }
  };

  return (
    <div>
      <button onClick={enviarMensaje}>Enviar mensaje al backend</button>
      <p>Respuesta: {response}</p>
    </div>
  );
}

export default App;
