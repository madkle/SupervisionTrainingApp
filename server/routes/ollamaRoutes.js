import express from "express";
import ollama from "ollama";
const router = express.Router();

// define the home page route
router.get("/test", async (req,res) => {
  /*
  curl http://localhost:11434/api/generate -d '{
    "model": "llama3.2",
    "prompt": "Why is the sky blue?"
  }'
  */
 
  const body = req.body;
  const message = "Why is the sky blue?"
  const model = "llama3.2"
  const response = await ollama.generate({
    model: model,
    message
  });

  console.log(response);
  
  res.json(response); // Send the entire response once it's ready
  console.log("Chat complete");
})
router.post('/chat', async (req, res) => {
    const body = req.body;
    console.log("body");
    console.log(body);
    
  console.log("Starting Ollama chat");

  const response = await ollama.chat({
    model: body.model,
    messages: body.messageLog,
    stream: false, // Set stream to false to avoid streaming
  });
  console.log("Server response");
  console.log(response);
  
  
  res.setHeader("Content-Type", "application/json");
  res.json(response); // Send the entire response once it's ready
  console.log("Chat complete");
  })
// define the home page route
router.post('/report', async (req, res) => {
    const body = req.body;
  const chatlog = body.chatLog;
  const generateTranscript = (array) => {
    let transcript = "";
    array.map((item, index) => {
      const content = item.content.replace(/\n\n/g, "");

      if (item.role !== "system") {
        transcript += `${
          item.role === "user" ? "Veileder" : "Lærling"
        }: ${content} \n\n`;
      }
    });
    return transcript;
  };
  try {
    console.log("Starting Ollama generation...");
    const characteristics =
      "Du er en lærer i faget Veiledning av lærlinger. Du lærer andre veiledningsmetoder og teknikker. Din student har nå gjennomført en veiledningssamtale med en lærling";
    // "You are a supervision teacher, teaching others about supervision methods. Your student has now had a supervision conversation with their trainee.";
    const instruction =
      "Se på samtalen mellom veilederen (studenten din) og deres lærling. Evaluer hvilke veiledningsmetoder og teknikker de har brukt.";
    //"Take a look at this interaction between a supervisor and their trainee. Evaluate which supervision methods and technique did the supervisor use?";
    const transcript = generateTranscript(chatlog);
    const parameters = "Skriv på norsk.";
    const format = `Respond in JSON. Use this as a template: 
{
  "title": "",
  "introduction": "",
  "techniques": [
    { "name": "", "description": "" },
    { "name": "", "description": "" }
  ],
  "limitations": [
    "",
    ""
  ],
  "summary": ""
}`;
    let prompt = `${characteristics} ${instruction} ${parameters} ${format} The conversation:${transcript}`;
    const output = await ollama.generate({
      model: "llama3.1",
      prompt,
      stream: false,
      format: "json",
    });

    res.status(200).send({ content: output });
  } catch (error) {
    console.error("Error with Ollama:", error);
    res.status(500).send("Error generating response.");
  }
  })
  
export default router