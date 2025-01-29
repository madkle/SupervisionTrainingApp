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
  const transcriptArray = [
    { role: "user", content: "Hei, hvordan går det med deg?" },
    {
      role: "assistant",
      content:
        "Hei! Det går okay, jeg trodde bare at jeg hadde godt nok avgang fra lærlingerperiode så langt. Men nå har du sagt at jeg ligger bak etter noen måneder, og jeg tenker også over hvorfor jeg ofte kommer for sent eller ikke er på jobb når jeg skal være der. Jeg er en type som helst gjerne åpne opp om jeg kan, men jeg tror nesten bare det nå, siden du har sagt dette.\n\nJeg har hatt litt god tid i jobben, jeg elsker å jobbe her og med kollegene. Men jeg har også vært veldig streng mot meg selv når det gjelder tidligere for sent innkallinger eller enkelte avtale som er blitt utsett igjen...",
    },
    {
      role: "user",
      content:
        "Så bra du liker å jobbe her. På hvilken måte har du tatt deg god tid i jobben?",
    },
    {
      role: "assistant",
      content:
        "Jeg liker virksomheten, og jeg tror det er en bra sted å lære og utvikle meg selv som arbeidspersonale. Jeg har fått tilbud om forskjellige oppdrag som jeg har vært glad for å være med på. Jeg har også hatt god kontakt med noen av kollegene, vi snakker mye om det enkelte og hjelper hverandre godt når vi trenger det.\n\nMen også noen ting som er litt usikre eller ukjente for meg etter 3 måneder på jobb...",
    },
    {
      role: "user",
      content: "Jeg skjønner, Hva slags ting er du usikker på?",
    },
    {
      role: "assistant",
      content:
        "Det ene jeg er usikker på er egentlig hvordan jeg skal få alt under kontroll når det gjelder tid og oppgaver. Jeg har vært litt dårlig til å sette prioriteringer og planlegge meg selv, så noen ganger har jeg kommet for sent eller glemt en del av oppdragene hjemme.\n\nJeg tror også at jeg noen ganger slipper opp på jobben ved å løse små oppgaver i stedet for det store bildet. Jeg vet at jeg må bli bedre til å se hvordan alle de forskjellige deloppgavene skal være sammen og hvordan de skal gå fremover.\n\nSvært god ting er imidlertid at du kommer overfor meg om hva som er en utfordring, det er et stort pluspunkt ved denne læreperioden.",
    },
  ];
  try {
    console.log("Starting Ollama generation...");
    const characteristics =
    "Du er en lærer i faget Veiledning av lærlinger. Du lærer andre veiledningsmetoder og teknikker. Din student har nå gjennomført en veiledningssamtale med en lærling"
     // "You are a supervision teacher, teaching others about supervision methods. Your student has now had a supervision conversation with their trainee.";
    const instruction =
    "Se på samtalen mellom veilederen (studenten din) og deres lærling. Evaluer hvilke veiledningsmetoder og teknikker de har brukt."  
    //"Take a look at this interaction between a supervisor and their trainee. Evaluate which supervision methods and technique did the supervisor use?";
    const transcript = `
  Veileder: Hei, hvordan går det med deg?
  Lærling: Hei! Det går okay, jeg trodde bare at jeg hadde godt nok avgang fra lærlingerperiode så langt. Men nå har du sagt at jeg ligger bak etter noen måneder, og jeg tenker også over hvorfor jeg ofte kommer for sent eller ikke er på jobb når jeg skal være der. Jeg er en type som helst gjerne åpne opp om jeg kan, men jeg tror nesten bare det nå, siden du har sagt dette.\n\nJeg har hatt litt god tid i jobben, jeg elsker å jobbe her og med kollegene. Men jeg har også vært veldig streng mot meg selv når det gjelder tidligere for sent innkallinger eller enkelte avtale som er blitt utsett igjen...
  Veileder:Så bra du liker å jobbe her. På hvilken måte har du tatt deg god tid i jobben?
  Lærling:Jeg liker virksomheten, og jeg tror det er en bra sted å lære og utvikle meg selv som arbeidspersonale. Jeg har fått tilbud om forskjellige oppdrag som jeg har vært glad for å være med på. Jeg har også hatt god kontakt med noen av kollegene, vi snakker mye om det enkelte og hjelper hverandre godt når vi trenger det.\n\nMen også noen ting som er litt usikre eller ukjente for meg etter 3 måneder på jobb...
  Veileder:Jeg skjønner, Hva slags ting er du usikker på?
  Lærling:Det ene jeg er usikker på er egentlig hvordan jeg skal få alt under kontroll når det gjelder tid og oppgaver. Jeg har vært litt dårlig til å sette prioriteringer og planlegge meg selv, så noen ganger har jeg kommet for sent eller glemt en del av oppdragene hjemme.\n\nJeg tror også at jeg noen ganger slipper opp på jobben ved å løse små oppgaver i stedet for det store bildet. Jeg vet at jeg må bli bedre til å se hvordan alle de forskjellige deloppgavene skal være sammen og hvordan de skal gå fremover.\n\nSvært god ting er imidlertid at du kommer overfor meg om hva som er en utfordring, det er et stort pluspunkt ved denne læreperioden.
`;
    const parameters = "Skriv på norsk.";
    const format = `Respond in JSON. Use this as a template: 
{
  "title": "tester tester 123",
  "introduction": "dra til helvete",
  "techniques": [
    { "name": "Empati", "description": "Morra di er feit" },
    { "name": "Refleksjon", "description": "Jeg elsker bananer" }
  ],
  "limitations": [
    "Veilederen er dum i hodet",
    "Manglet ryggerad og hjerneseller"
  ],
  "summary": "Denne samtalen var ubrukelig"
}`
/*
const llamaFormat = {
  "type": "object",
  "properties": {
    "title":{"type":"string"},
    "introduction":{"type":"string"},
    "techniques":{"type":"array","properties": {[
      "name": {type}
    ]}},
    "limitations":{"type":"array"},
    "summary":{"type":"string"},
  },
  "required":[
    "title",
    "introduction",
    "techniques",
    "limitations",
    "summary"
  ]
} 
  */
    let prompt = `${characteristics} ${instruction} ${parameters} ${format} The conversation:${transcript}`;
    const output = await ollama.generate({
      model: "llama3.1",
      prompt,
      stream: false,
      format:"json",
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

// Route for transcription
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
