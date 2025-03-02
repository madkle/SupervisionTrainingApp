import express from "express";
import cors from "cors";

import ollamaRoutes from "./routes/ollamaRoutes.js"
import openAIRoutes from "./routes/openAI.js"
const app = express();
const port = 5000;


// Enable CORS for all routes
app.use(cors());



app.use(express.json());

app.use('/ollama', ollamaRoutes)
app.use('/openai', openAIRoutes)



// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });