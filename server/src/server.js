const express = require("express");
const OpenAI = require("openai");
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");

// Load .env file
dotenv.config();

const app = express();
const port = 5000;
// Enable CORS for all routes
app.use(cors());

const openai = new OpenAI({
  apiKey:process.env.OPENAI_API_KEY

});

app.use(express.json());

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
