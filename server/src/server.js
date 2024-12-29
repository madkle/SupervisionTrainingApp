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



app.post("/api/testOllamaChat", async (req, res) => {
  const body = req.body;
  console.log(body.messageLog);
  
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Transfer-Encoding", "chunked");
  console.log("Starting Ollama chat");
  
  const response = await ollama.chat({
    model: body.model,
    messages: body.messageLog,
    stream: true,
  });

  for await (const part of response) {
    res.write(part.message.content);
  }
  console.log("done");
  
  
  res.end();
});









app.post("/api/streamTest", async (req, res) => {
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Transfer-Encoding", "chunked");
  res.flushHeaders();

  const text =
    "This is a test of true streaming. Each word streams incrementally to the client.";
  const words = text.split(" "); // Split text into words
  const delay = 500; // Delay in ms between sending each word

  for (const word of words) {
    res.write(word + " "); // Send one word at a time
    console.log(`Sent: ${word}`);
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  res.end(); // End the response stream
});

app.post("/api/ollamaChat", async (req, res) => {
  try {
    console.log("Starting Ollama chat");
    const message = [
      { role: "system", content: "You are going to asnwer simply with max 50 words" },
      { role: "user", content: "Why is the sky blue?" },
    ];
    const response = await ollama.chat({
      model: "llama3.1",
      messages: message,
      stream: true,
    });
    console.log("\n Response \n");
    console.log();
    
    console.log("\n Stream \n");
    for await (const part of response) {
      process.stdout.write(part.message.content);
    }
    console.log("\n done");
    console.log(response);
    
    res.status(200).send(response);
  } catch (error) {
    console.error("Error with Ollama chat:", error);
    res.status(500).send("Error generating chat response.");
  }
});

app.post("/api/ollama", async (req, res) => {
  try {
    console.log("Starting Ollama with streaming...");
    const prompt = "Why is the sky blue? Keep the answer short. Max 150 words.";

    const output = await ollama.generate({
      model: "llama3.1",
      prompt,
      stream: true,
    });

    res.setHeader("Content-Type", "text/plain");

    for await (const part of output) {
      res.write(part.response); // Stream each chunk to the client
    }

    res.end(); // Close the response
  } catch (error) {
    console.error("Error with Ollama:", error);
    res.status(500).send("Error generating response.");
  }
});

/*
// Endpoint to handle Ollama API
app.post("/api/ollama", async (req, res) => {
  try {
    console.log("Starting Ollama...");
    const prompt = "Why is the sky blue? Keep the answer short. Max 15 words.";

    const output = await ollama.generate({
      model: "llama3.1",
      prompt,
      stream: false,
    });
    
    //code to get it to stream in server
    //for await (const part of output) {
      //process.stdout.write(part.response);
    //}
    res.status(200).send({ content: output });
  } catch (error) {
    console.error("Error with Ollama:", error);
    res.status(500).send("Error generating response.");
  }
});
*/
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

// Route for transcription
app.post("/api/transcribe", async (req, res) => {
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
