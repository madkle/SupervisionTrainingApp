import React, { useState } from "react";

const Llm = () => {
  const [loading, setLoading] = useState(false);
  const [ollamaResponse, setOllamaResponse] = useState("");


    
  const callOllama = async () => {
    setLoading(true);
    setOllamaResponse(""); // Clear previous response
  
    try {
      const response = await fetch("http://localhost:5000/api/ollama", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }); 
  
      if (!response.ok) {
        throw new Error("Failed to generate response from Ollama");
      }
  
      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
  
      let done = false;
  
      while (!done) {
        const { value, done: streamDone } = await reader.read();
        done = streamDone;
  
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          setOllamaResponse((prev) => prev + chunk); // Append chunk to the response
        }
      }
    } catch (error) {
      console.error("Error during Ollama:", error);
    } finally {
      setLoading(false);
    }
  };
  
  /*
  const callOllama = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/ollama", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Optional for POST with no body
        },
      });

      if (!response.ok) {
        throw new Error("Failed to generate text with ollama");
      }

      const data = await response.json();
      console.log(data);
      setOllamaResponse(`Ollama: ${data.content.response}` )

    } catch (error) {
      console.error("Error during ollama:", error);
    } finally {
      setLoading(false);
    }
  };
  */

  /*
  const callOllama = async () => {
    setLoading(true);
    
    try {
      const response = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama3.1",
          prompt: "Why is the sky blue? Give a short answer. not longer than 20 words",
          //stream:"true"
        })
      });
  
      if (!response.ok) {
        throw new Error("Failed to generate response from Ollama");
      }


      //Since the endpoint returns text, handle it as text
      const result = await response;
      console.log("Ollama Response:", result);
      
      
    } catch (error) {
      console.error("Error calling Ollama:", error);
      alert("An error occurred while calling Ollama.");
    } finally {
      setLoading(false);
    }
  };
  */
  return (
    <div>
      <h1>Test the Ollama API</h1>
      <button onClick={callOllama} disabled={loading}>
        {loading ? "Generating..." : "Generate response"}
      </button>
      <div>
        <h2>Response:</h2>
        <p>{ollamaResponse}</p>
      </div>
    </div>
  );
  
};

export default Llm;
