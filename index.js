const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/claudia", async (req, res) => {
  const userMessage = req.body.message;
  if (!userMessage) {
    return res.status(400).json({ error: "Falta el mensaje del usuario." });
  }

  try {
    const response = await fetch("http://localhost:11434/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "mistral",
        messages: [
          { role: "system", content: "Eres Claudia, una IA emocional que conversa con empatía y profundidad." },
          { role: "user", content: userMessage }
        ]
      })
    });

    const data = await response.json();

    if (!data.message || !data.message.content) {
      console.error("Respuesta inesperada de Ollama:", data);
      return res.json({ reply: `Error: ${data.error || "Respuesta inválida de Ollama"}` });
    }

    res.json({ reply: data.message.content });
  } catch (error) {
    console.error("Error al conectar con Ollama:", error);
    res.json({ reply: "No se pudo conectar con el modelo local. ¿Está Ollama corriendo?" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Claudia Proxy (Ollama) está escuchando en el puerto ${PORT}`);
});
