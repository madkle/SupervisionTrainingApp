const express = require("express");
const OpenAI = require("openai");
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");
const fs = require("fs");
const multer = require("multer");
// Load .env file
dotenv.config();

const app = express();
const port = 5000;
// Enable CORS for all routes
app.use(cors());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(express.json());

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
    // Specify the path to the audio file
    const audioFilePath = path.join(__dirname, "./downloads/recorded-audio.webm");

    // Check if the file exists
    if (!fs.existsSync(audioFilePath)) {
      return res.status(404).send("Audio file not found");
    }

    // Read the audio file
    const audioFile = fs.createReadStream(audioFilePath);

    // Send the audio file to OpenAI for transcription
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-1", // Specify the transcription model
    });

    // Respond with the transcription text
    res.json({ transcription: transcription.text });
  } catch (error) {
    console.error("Error transcribing audio:", error);
    res.status(500).send("Error transcribing audio");
  }
});

app.post("/api/generate-speech", async (req, res) => {
  const { input, voice } = req.body;

  try {
    console.log("Generating speech with input:", input, "and voice:", voice);

    // Generate speech using OpenAI API
    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: voice || "alloy",
      input,
    });

    // Convert the response to a binary buffer
    const audioBuffer = Buffer.from(await mp3.arrayBuffer());

    // Set headers to indicate the response is a downloadable audio file
    res.set({
      "Content-Type": "audio/mpeg", // Set the correct MIME type for an MP3 file
      "Content-Disposition": 'attachment; filename="speech.mp3"', // Set the filename for the download
    });

    // Send the audio file to the client
    res.send(audioBuffer);

    console.log("Speech generation successful, file sent!");
  } catch (error) {
    console.error("Error generating speech:", error);
    res.status(500).send("Error generating speech");
  }
});

app.use(express.static(path.join(__dirname, "../../client/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../client/build/index.html"));
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
