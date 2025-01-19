import React, { useState } from "react";

const Tts = () => {
  const [input, setInput] = useState("");
  const [voice, setVoice] = useState("alloy");
  const [loading, setLoading] = useState(false);

  const generateSpeech = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/generate-speech", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input, voice }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to generate speech");
      }
  
      // Handle response as a Blob (binary data)
      const blob = await response.blob();
  
      // Create a URL for the Blob and trigger a download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "speech.mp3"; // Set the desired filename
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
  
      // Clean up the Blob URL
      window.URL.revokeObjectURL(url);
  
      console.log("Speech file downloaded successfully!");
    } catch (error) {
      console.error("Error generating speech:", error);
      alert("An error occurred while generating the speech.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div>
      <h1>Text-to-Speech Generator</h1>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter text to generate speech"
        rows="4"
        cols="50"
      />
      <br />
      <label>
        Voice:
        <select value={voice} onChange={(e) => setVoice(e.target.value)}>
          <option value="alloy">Alloy</option>
          <option value="other-voice">Other Voice</option>
        </select>
      </label>
      <br />
      <button onClick={generateSpeech} disabled={loading}>
        {loading ? "Generating..." : "Generate Speech"}
      </button>
    </div>
  );
};

export default Tts;
