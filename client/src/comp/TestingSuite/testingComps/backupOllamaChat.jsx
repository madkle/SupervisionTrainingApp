import React, { useState } from "react";

/*
const sendMessage = async (message: string) => {
  setMessage(message, Role.USER);
  setIsLoading(true);

  // send message to the server
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_PATH}/api/chat`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json, text/plain, ",
      }, 
      body: JSON.stringify({ message }),
    }
  );

  setIsLoading(false);

  if (!response.ok || !response.body) {
    throw response.statusText;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { done, value } = await reader.read();
    if (done) return;
    const chunk = decoder.decode(value, { stream: true });
    streamMessage(chunk);
  }
};
*/

const OllamaChat = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    //setMessages(e.target.value);

  };

  const streamMessage = (chunk) => {
    console.log(chunk);
    console.log(messages);
    console.log(isLoading);
    setMessages((prev) => {
      return [...prev, chunk];
    
    });
    console.log("messages set");
    console.log(messages);
    
    /*
    setMessages((prev) => {
      const messages = JSON.parse(JSON.stringify(prev));
      const lastMessage = messages[messages.length - 1];
      if (!lastMessage || lastMessage.from === "user")
        return [...prev, { from: "ai", text: chunk }];

      lastMessage.text += chunk;
      return [...messages.slice(0, -1), lastMessage];
    });
    */
  };


  const handleSendMessage = async () => {
    setMessages(messages, "user");
    setIsLoading(true);
    
    // send message to the server
    /*
    const response = await fetch(`http://localhost:5000/api/testOllamaChat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json, text/plain, ",
      },
      body: JSON.stringify({ message }),
    });

    setIsLoading(false);

    if (!response.ok || !response.body) {
      throw response.statusText;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const { done, value } = await reader.read();
      if (done) return;
      const chunk = decoder.decode(value, { stream: true });
      streamMessage(chunk);
      //console.log(chunk);
      
    }
      */
  };

  /*
    const handleSendMessage = async () => {
        try {
          const response = await fetch("http://localhost:5000/api/ollamaChat", {
            method: "POST",
            headers: {
              "Content-Type": "application/json", // Optional for POST with no body
            },
          });
    
          if (!response.ok) {
            throw new Error("Failed to transcribe audio");
          }
    
          const data = await response.json();
          console.log(data);
        } catch (error) {
          console.error("Error during transcription:", error);
        } 
      };
*/
  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h1>Ollama Chat</h1>

      <div
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          height: "300px",
          overflowY: "scroll",
          marginBottom: "10px",
        }}
      >
        {conversation.map((msg, index) => (
          <div
            key={index}
            style={{
              margin: "5px 0",
              textAlign: msg.sender === "User" ? "right" : "left",
            }}
          >
            <strong>{msg.sender}: </strong>
            <span>{msg.text}</span>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: "10px" }}>
        <input
          type="text"
          value={message}
          onChange={handleInputChange}
          style={{ flexGrow: 1, padding: "10px", fontSize: "16px" }}
          placeholder="Type your message here..."
        />
        <button
          onClick={handleSendMessage}
          disabled={isLoading}
          style={{ padding: "10px", fontSize: "16px" }}
        >
          {isLoading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
};

export default OllamaChat;


/*
import React, { useState, useRef } from "react";

const OllamaChat = () => {
  const [messageLog, setMessageLog] = useState([
    {
      role: "assistant",
      content: "Hello! How can I help you today?",
    },
    {
      role: "User",
      content: "Hey, I need help with something. why is the sky blue?",
    },
    {
      role: "assistant",
      content:
        "The sky is blue because of the way the Earth's atmosphere scatters sunlight. The short-wavelength blue and violet scatter more than other colors, making the sky appear blue.",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);
  const [isWaiting, setIsWaiting] = useState(false);

  const handleReturnedMessage = (message) => {
    console.log("Message returned from server: ", message);
    const updatedMessageLog = [
      ...messageLog,
      {
        role: "assistant",
        content: message,
      },
    ];

    setMessageLog(updatedMessageLog);
  };



  const streamMessage = (chunk) => {
    console.log(chunk);
    console.log("Message returned from server: ", chunk);
    const updatedMessageLog = [
      ...messageLog,
      {
        role: "assistant",
        content: chunk,
      },
    ];

    setMessageLog(updatedMessageLog);
    console.log("Message log updated: ");
    console.log(messageLog);
    
  };




  const handleSendMessage = async () => {
    setIsLoading(true);

    // Update the message log with the new message
    const updatedMessageLog = [
      ...messageLog,
      {
        role: "User",
        content: inputMessage,
      },
    ];

    setMessageLog(updatedMessageLog);

    // Send the updated message log to the server
    console.log("Sending message to server...");
    console.log(updatedMessageLog);

    const response = await fetch(`http://localhost:5000/api/testOllamaChat`, {
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
        setInputMessage("");
        return;
      }
      const chunk = decoder.decode(value, { stream: true });
      streamMessage(chunk);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  };

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
  };
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
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
          marginBottom: "10px",
        }}
      >
        {messageLog.map((msg, index) => (
          <div
            key={index}
            style={{
              margin: "5px 0",
              textAlign: msg.role === "User" ? "right" : "left",
            }}
          >
            <strong>{capitalizeFirstLetter(msg.role)}: </strong>
            <span>{msg.content}</span>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: "10px" }}>
        <input
          ref={inputRef}
          type="text"
          value={inputMessage}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          style={{ flexGrow: 1, padding: "10px", fontSize: "16px" }}
          placeholder="Type your message here..."
        />
        <button
          onClick={handleSendMessage}
          disabled={isLoading}
          style={{ padding: "10px", fontSize: "16px" }}
        >
          {isLoading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
};

export default OllamaChat;


*/