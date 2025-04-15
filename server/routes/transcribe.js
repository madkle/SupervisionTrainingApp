import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { OpenAI } from "openai";
import dotenv from "dotenv";

// Emulate __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Point to the external .env file
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


const transcribe = async () => {
  try {
    const filePath = "./Master_Rambling_1.m4a";
    const fileOutputPath = path.join(__dirname, "transcription.txt");
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(filePath),
      model: "whisper-1",
      language: "no", // Norwegian
      response_format: "text",
    });

    console.log("✅ Transcription complete:\n");
    console.log(transcription);
    fs.writeFileSync(fileOutputPath, transcription, "utf8");
  } catch (error) {
    console.error("❌ Error during transcription:", error);
  }
};

transcribe();
