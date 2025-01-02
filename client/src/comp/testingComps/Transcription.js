import React, { useState } from "react";

const Transcription = () => {
  const [transcription, setTranscription] = useState("");
  const [loading, setLoading] = useState(false);

  const transcribeAudio = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/transcribeLocalAudio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Optional for POST with no body
        },
        body: JSON.stringify({
          audioFile: "/path/to/audio/file",
          model: "whisper-1",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to transcribe audio");
      }

      const data = await response.json();
      setTranscription(data.transcription);
    } catch (error) {
      console.error("Error during transcription:", error);
      setTranscription("An error occurred while transcribing the audio.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>Audio Transcription</h1>
      <button onClick={transcribeAudio} disabled={loading}>
        {loading ? "Transcribing..." : "Transcribe Audio"}
      </button>
      <div style={{ marginTop: "20px" }}>
        {transcription && (
          <>
            <h3>Transcription Result:</h3>
            <p>{transcription}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default Transcription;
