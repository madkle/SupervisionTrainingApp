import React, { useState } from "react";

const StreamTest = () => {
  const [streamingResponse, setStreamingResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const callOllamaDirect = async () => {
    setStreamingResponse(""); // Clear previous response
    setLoading(true);

    try {
      const response = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "llama3.1",
          prompt: "Why is the sky blue? Provide a short response.",
          stream: true,
        }),
      });

      if (!response.body) {
        throw new Error("ReadableStream is not supported in this environment");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        let lines = buffer.split("\n"); // Split the buffer into lines
        buffer = lines.pop(); // Keep the last incomplete line in the buffer

        for (let line of lines) {
          if (line.trim()) {
            try {
              const parsed = JSON.parse(line); // Parse the JSON line
              setStreamingResponse((prev) => prev + parsed.response); // Append the response part
            } catch (error) {
              console.error("Failed to parse JSON line:", line);
            }
          }
        }
      }

      if (buffer.trim()) {
        try {
          const parsed = JSON.parse(buffer);
          setStreamingResponse((prev) => prev + parsed.response);
        } catch (error) {
          console.error("Failed to parse final JSON buffer:", buffer);
        }
      }
    } catch (error) {
      console.error("Error during streaming:", error);
    } finally {
      setLoading(false);
    }
  };

  const responseBoxStyle = {
    whiteSpace: "pre-wrap", // Preserve whitespace and wrap text
    wordWrap: "break-word", // Break long words to fit the box
    overflowY: "auto", // Add vertical scroll if content overflows
    overflowX: "hidden", // Prevent horizontal scrolling
    maxHeight: "300px", // Optional: Limit the height of the box
    padding: "10px", // Add padding for better readability
    border: "1px solid #ccc", // Optional: Add a border for visual clarity
    borderRadius: "5px", // Optional: Rounded corners
    backgroundColor: "#f9f9f9", // Optional: Background color
    fontFamily: "Arial, sans-serif", // Use a readable font
    fontSize: "14px", // Adjust text size
    lineHeight: "1.5", // Better line spacing
  };

  return (
    <div>
      <h1>Stream Test with Ollama</h1>
      <button onClick={callOllamaDirect} disabled={loading}>
        {loading ? "Streaming..." : "Start Stream"}
      </button>
      <pre style={responseBoxStyle}>{streamingResponse}</pre>
    </div>
  );
};

export default StreamTest;
