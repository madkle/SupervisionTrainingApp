const express = require("express");
const OpenAI = require("openai");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const port = 5000;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(express.json());

app.post("/api/generate-speech", async (req, res) => {
  const { input, voice } = req.body;

  try {
    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: voice || "alloy",
      input,
    });

    res.json({ audio: mp3 });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error generating speech");
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
