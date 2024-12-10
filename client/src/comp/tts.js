import { useState } from "react";
import OpenAI from "openai/index.js";
function App() {
  const [loading, setLoading] = useState(false);
  const generateSpeech = async () => {
    setLoading(true);
    try {
      const openai = new OpenAI({
        apiKey: process.env.REACT_APP_OPENAI_API_KEY, // Ensure this is set in your .env file
        dangerouslyAllowBrowser: true
      });

      const mp3 = await openai.audio.speech.create({
        model: "tts-1",
        voice: "alloy",
        input: "Today is a wonderful day to build something people love!",
      });

      // Create a blob from the audio buffer
      const audioBlob = new Blob([await mp3.arrayBuffer()], { type: "audio/mp3" });

      // Create a URL for the blob
      const audioUrl = URL.createObjectURL(audioBlob);

      // Trigger download
      const a = document.createElement("a");
      a.href = audioUrl;
      a.download = "speech.mp3";
      a.click();

      // Revoke the URL to free up memory
      URL.revokeObjectURL(audioUrl);
    } catch (error) {
      console.error("Error generating speech:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={generateSpeech} disabled={loading}>
        {loading ? "Generating..." : "Generate Speech"}
      </button>
    </div>
  );
}

export default App;
