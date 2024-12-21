import React, { useState } from 'react';
const OllamaChat = () => {
    const [message, setMessage] = useState('');
    const [conversation, setConversation] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e) => {
        setMessage(e.target.value);
    };

    const handleSendMessage = async () => {
        try {
          const response = await fetch("/api/ollamaChat", {
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

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <h1>Ollama Chat</h1>

            <div style={{ border: '1px solid #ccc', padding: '10px', height: '300px', overflowY: 'scroll', marginBottom: '10px' }}>
                {conversation.map((msg, index) => (
                    <div key={index} style={{ margin: '5px 0', textAlign: msg.sender === 'User' ? 'right' : 'left' }}>
                        <strong>{msg.sender}: </strong>
                        <span>{msg.text}</span>
                    </div>
                ))}
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
                <input
                    type="text"
                    value={message}
                    onChange={handleInputChange}
                    style={{ flexGrow: 1, padding: '10px', fontSize: '16px' }}
                    placeholder="Type your message here..."
                />
                <button
                    onClick={handleSendMessage}
                    disabled={isLoading}
                    style={{ padding: '10px', fontSize: '16px' }}
                >
                    {isLoading ? 'Sending...' : 'Send'}
                </button>
            </div>
        </div>
    );
};

export default OllamaChat;
