import express from "express";
import OpenAI from "openai";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import fs from "fs";
import multer from "multer";
import ollama from "ollama";
import { fileURLToPath } from "url";

// Load environment variables
dotenv.config();

// Determine __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 5000;

// Enable CORS for all routes
app.use(cors());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(express.json());

app.post("/api/ollamaChat", async (req, res) => {
  const body = req.body;

  console.log("Starting Ollama chat");

  const response = await ollama.chat({
    model: body.model,
    messages: body.messageLog,
    stream: false, // Set stream to false to avoid streaming
  });

  res.setHeader("Content-Type", "application/json");
  res.json(response); // Send the entire response once it's ready
  console.log("Chat complete");
});

app.post("/api/ollamaGenerate", async (req, res) => {
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
});

// Ensure the downloads directory exists
const DOWNLOADS_DIR = path.join(__dirname, "downloads");
if (!fs.existsSync(DOWNLOADS_DIR)) {
  fs.mkdirSync(DOWNLOADS_DIR);
}

// Multer configuration for saving uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DOWNLOADS_DIR); // Save files to the downloads directory
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Use the original file name
  },
});
const upload = multer({ storage });

// Endpoint to handle audio uploads
app.post("/api/save-audio", upload.single("file"), (req, res) => {
  try {
    console.log(`File received: ${req.file.filename}`);
    res.status(200).send("Audio file saved successfully.");
  } catch (error) {
    console.error("Error saving file:", error);
    res.status(500).send("Error saving file.");
  }
});

//endpoint for transcription
app.post("/api/transcribe", upload.single("audio"), async (req, res) => {
  try {
    // Access the uploaded file and form data
    const audioFilePath = req.file.path;
    const AIModel = req.body.model;

    console.log(`File received: ${audioFilePath}`);
    console.log(`Model selected: ${AIModel}`);

    // Create a readable stream from the uploaded file
    const audioFile = fs.createReadStream(audioFilePath);

    // Send audio file to OpenAI for transcription
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: AIModel,
    });

    // Clean up the uploaded file to avoid storage issues
    fs.unlinkSync(audioFilePath);

    // Send transcription result back to client
    res.json({ transcription: transcription.text });
  } catch (error) {
    console.error("Error transcribing audio:", error);

    // Clean up the uploaded file in case of errors
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).send("Error transcribing audio");
  }
});

// Route for local transcription
app.post("/api/transcribeLocalAudio", async (req, res) => {
  try {
    const audioFilePath = path.join(DOWNLOADS_DIR, "recorded-audio.webm");

    if (!fs.existsSync(audioFilePath)) {
      return res.status(404).send("Audio file not found");
    }

    const audioFile = fs.createReadStream(audioFilePath);

    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-1",
    });

    res.json({ transcription: transcription.text });
  } catch (error) {
    console.error("Error transcribing audio:", error);
    res.status(500).send("Error transcribing audio");
  }
});

// Endpoint to generate speech
app.post("/api/generate-speech", async (req, res) => {
  const { input, voice } = req.body;

  try {
    console.log("Generating speech with input:", input, "and voice:", voice);

    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: voice || "alloy",
      input,
    });

    const audioBuffer = Buffer.from(await mp3.arrayBuffer());

    res.set({
      "Content-Type": "audio/mpeg",
      "Content-Disposition": 'attachment; filename="speech.mp3"',
    });

    res.send(audioBuffer);

    console.log("Speech generation successful, file sent!");
  } catch (error) {
    console.error("Error generating speech:", error);
    res.status(500).send("Error generating speech");
  }
});

// Serve React build files
app.use(express.static(path.join(__dirname, "../../client/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../client/build/index.html"));
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
