import express from "express";
import OpenAI from "openai";
import dotenv from "dotenv";
import fs from "fs";
import { upload } from "./middleware/fileUpload.js";

const router = express.Router();
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
// define the home page route
router.post("/gen", async (req, res) => {
  const { samtalelogg } = req.body;
  
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // eller gpt-3.5-turbo hvis du vil spare penger 
      temperature: 0.2,
      //response_format: "json", // 🔥 Dette sikrer parsbar output
      messages: [
        {
          role: "system",
          content: `
Du er en ekspert på veiledning. Du skal analysere en veiledningssamtale mellom en student (veileder) og en lærling.

Du skal returnere følgende JSON-struktur:
{
  "brukteMetoder": [
    {
      "metode": "string",
      "eksempel": "string",
      "vurdering": "string"
    }
  ],
  "styrker": ["string", "..."],
  "forbedringer": ["string", "..."],
  "videreutvikling": ["string", "..."],
  "oppsummering": "string"
}

Svar kun i gyldig JSON, ikke noe String svar.
          `.trim(),
        },
        {
          role: "user",
          content: `Samtalelogg:\n${samtalelogg}`,
        },
      ],
    });
    
    const jsonString = completion.choices[0]?.message?.content;

    const feedback = JSON.parse(jsonString);
    
    res.send(feedback);
    console.log("Feedback generation successful!");
  } catch (err) {
    console.error("Feil ved generering av tilbakemelding:", err);
    res.status(500).send("Error generating feedback");
  }
});

router.post("/tts", async (req, res) => {
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
router.get("/test", (req, res) => {
  res.json({ message: "API is working!" });
});
// define the home page route
router.post("/stt", upload.single("audio"), async (req, res) => {
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

export default router;
