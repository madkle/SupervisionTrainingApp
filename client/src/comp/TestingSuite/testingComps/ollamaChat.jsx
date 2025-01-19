import React, { useState, useRef } from "react";

const OllamaChat = () => {
  const character = { name: "Claude", age: 25, occupation: "student", workplace: "Nursing home", personality: "shy and introverted" };
  const exampleData = [
    {
      role: "system",
      content: `Lets roleplay. Your character is ${character.name}, who is ${character.age} years old. You are a ${character.personality} ${character.occupation} who has been coming late to work at the ${character.workplace} the past month. You are called into a supervision meeting with you supervisor to answer some questions about your absense. You are nervous and anxious about the meeting. answer accordingly. if you dont know the answer, just say you dont know.`,
    },
    {
      role: "assistant",
      content: "Hello... What did you want to talk about today?",
    },
  ];
  const [messageLog, setMessageLog] = useState(exampleData);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);
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
      body: JSON.stringify({ messageLog: updatedMessageLog }),
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

  const streamMessage = (chunk) => {
    console.log("Message returned from server: ", chunk);

    setMessageLog((prevMessageLog) => {
      const updatedMessageLog = [
        ...prevMessageLog,
        {
          role: "assistant",
          content: chunk,
        },
      ];

      console.log("Message log updated: ", updatedMessageLog);
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
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
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
              <strong>{msg.role === "assistant" ? character.name : msg.role}:</strong> {msg.content}
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
          ref={inputRef}
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
    </div>
  );
};

export default OllamaChat;
