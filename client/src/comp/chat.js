import React, { useState, useRef } from "react";
import { generateSpeech } from "./functionality/textToSpeech";
import { callChatAPI,character,exampleData } from "./functionality/ollamaChat.js";
import {handleAudioResponse} from "./functionality/audioHanlder.js";
const OllamaChat = () => {
  
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
   
    handleServerMessage(await callChatAPI(updatedMessageLog, llmModel));
    
    setInputMessage(""); // Clear the input field
  };
  
  const handleServerMessage = async (serverResponse) => {
    const message = serverResponse.message;
    console.log("Message returned from server: ", serverResponse);
    
    const audioURL = await handleAudioResponse(message.content);
    setAudioLog((prevAudioLog) => [...prevAudioLog, audioURL]);
    setAudioResponse(audioURL);

    setMessageLog((prevMessageLog) => {
      const updatedMessageLog = [
        ...prevMessageLog,
        message,
      ];
      setIsLoading(false);
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
