import express from "express";
import cors from "cors";

import ollamaRoutes from "./routes/ollamaRoutes.js";
import openAIRoutes from "./routes/openAI.js";
const app = express();
const port = 5000;

// Enable CORS for all routes
app.use(cors(/*{
  origin: ["https://madsmk.no", "https://www.madsmk.no"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: "Content-Type,Authorization",
  credentials: true
}*/));


app.use(express.json());

app.use("/api/ollama", ollamaRoutes);
app.use("/api/openai", openAIRoutes);

// Start the server
app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${port}`);
});
