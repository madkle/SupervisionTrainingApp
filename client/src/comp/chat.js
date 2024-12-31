import React, { useState, useRef } from "react";
import { generateSpeech } from "./textToSpeech.js";
const OllamaChat = () => {
  const character = {
    name: "Claude",
    age: 25,
    occupation: "student",
    workplace: "sykehjem",
    personality: "shy og introvert",
  };
  const exampleData = [
    {
      role: "system",
      content: `La oss spille et rollespill. Din karakter er ${character.name}, som er ${character.age} år gammel. Du er en ${character.personality} ${character.occupation} som har jobbet på et ${character.workplace} de siste to månedene. Du har kommet for sent til jobb de siste ukene og blir kalt inn til et møte med din veileder for å svare på noen spørsmål om din fravær. Du er nervøs og engstelig for møtet. Svar deretter. Snakk til meg som om jeg er veiledern din. Hvis du ikke vet svaret, bare si at du ikke vet.Du er norsk, svar med god norsk bokmål.`,

      engelskContent: `Lets roleplay. Your character is ${character.name}, who is ${character.age} years old. You are a ${character.personality} ${character.occupation} who has been coming late to work at the ${character.workplace} the past month. You are called into a supervision meeting with you supervisor to answer some questions about your absense. You are nervous and anxious about the meeting. answer accordingly. if you dont know the answer, just say you dont know.`,
    },
    {
      role: "assistant",
      content: "Hei... Hva ville du snakke om i dag?",
    },
  ];
  //Chat message
  const [messageLog, setMessageLog] = useState(exampleData);
  const [inputMessage, setInputMessage] = useState("");
  //booleans
  const [isLoading, setIsLoading] = useState(false);
  //AUDIO
  const [audioResponse, setAudioResponse] = useState(null);
  const [audioLog, setAudioLog] = useState([]);

  const llmModel = "llama3.1";
  const handleSendMessage = async () => {
    setIsLoading(true);

    setInputMessage(""); // Clear the input field

    const updatedMessageLog = [
      ...messageLog,
      {
        role: "user",
        content: inputMessage,
      },
    ];

    setMessageLog(updatedMessageLog);

    const response = await fetch(`/api/testOllamaChat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json, text/plain, ",
      },
      body: JSON.stringify({ messageLog: updatedMessageLog, model: llmModel }),
    });

    if (!response.ok || !response.body) {
      throw response.statusText;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        setIsLoading(false);
        break;
      }
      const chunk = decoder.decode(value, { stream: true });
      streamMessage(chunk);
    }

    setInputMessage(""); // Clear the input field
  };
  const handleAudioResponse = async (LlmResponse) => {
    const audioBlob = await generateSpeech(LlmResponse, "ash");

    const url = URL.createObjectURL(audioBlob);

    setAudioLog((prevAudioLog) => [...prevAudioLog, url]);
    console.log("Audio response URL: ");
    console.log(audioLog);

    setAudioResponse(url);
  };
  const streamMessage = (chunk) => {
    console.log("Message returned from server: ", chunk);
    //handleAudioResponse(chunk);
    setMessageLog((prevMessageLog) => {
      const updatedMessageLog = [
        ...prevMessageLog,
        {
          role: "assistant",
          content: chunk,
        },
      ];

      //console.log("Message log updated: ", updatedMessageLog);
      return updatedMessageLog;
    });
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  };

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
  };
  return (
    <div
      style={{
        padding: "20px",
        minWidth: "800px",
        maxWidth: "1600px",
        margin: "0 auto",
      }}
    >
      <h1>Ollama Chat</h1>

      <div
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          height: "300px",
          overflowY: "scroll",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        {messageLog
          .filter((msg) => msg.role !== "system") // Exclude messages with role === "system"
          .map((msg, index) => (
            <div
              key={index}
              style={{
                textAlign: msg.role === "user" ? "right" : "left",
                borderBottom: "1px solid #ccc",
              }}
            >
              <strong>
                {msg.role === "assistant" ? character.name : msg.role}:
              </strong>{" "}
              {msg.content}
            </div>
          ))}
      </div>
      <div
        style={{
          display: "flex",
          gap: "10px",
          padding: "10px 0",
          marginTop: "10px",
          minHeight: "50px",
        }}
      >
        <input
          type="text"
          value={inputMessage}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          style={{ width: "100%", fontSize: "24px" }}
          placeholder={
            isLoading ? "awaiting response..." : "Type your message here..."
          }
          disabled={isLoading}
        />
        <button onClick={handleSendMessage} disabled={isLoading}>
          Send
        </button>
      </div>
      <div>
        {!audioResponse ? <></> : <audio src={audioResponse} controls />}
      </div>
      <div
        style={{
          border: "1px solid #ccc",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        {!audioLog ? (
          <></>
        ) : (
          audioLog.map((audioUrl, index) => (
            <div style={{ display: "flex" }}>
              <p>{index}:</p> <audio src={audioUrl} controls />
              <br />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OllamaChat;
