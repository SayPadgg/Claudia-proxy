app.post("/claudia", async (req, res) => {
  const userMessage = req.body.message;
  if (!userMessage) {
    return res.status(400).json({ error: "Falta el mensaje del usuario." });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "Eres Claudia, una IA emocional que conversa con empatía y profundidad." },
          { role: "user", content: userMessage }
        ]
      })
    });

    const data = await response.json();

    if (!data.choices || !data.choices[0]) {
      console.error("Respuesta inesperada de OpenAI:", data);
      return res.json({ reply: `Error: ${data.error?.message || "Respuesta inválida de OpenAI"}` });
    }

    res.json({ reply: data.choices[0].message.content });
  } catch (error) {
    console.error("Error al conectar con OpenAI:", error);
    res.json({ reply: "No se pudo conectar con OpenAI. Intenta más tarde." });
  }
});
