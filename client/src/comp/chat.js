// OllamaChat.jsx
import React, { useState } from "react";
import { generateSpeech } from "./functionality/textToSpeech";
import { callChatAPI, character, exampleData } from "./functionality/ollamaChat.js";
import { handleAudioResponse } from "./functionality/audioHanlder.js";
import '../styling/OllamaChat.css';

const OllamaChat = () => {
    const [messageLog, setMessageLog] = useState(exampleData);
    const [inputMessage, setInputMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [audioLog, setAudioLog] = useState([]);
    const audioCache = useState(new Map())[0];

    const llmModel = "llama3.1";

    const handleSendMessage = async () => {
        setIsLoading(true);
        setInputMessage("");

        const updatedMessageLog = [...messageLog, { role: "user", content: inputMessage }];
        setMessageLog(updatedMessageLog);

        const serverResponse = await callChatAPI(updatedMessageLog, llmModel);
        await handleServerMessage(serverResponse);
    };

    const handleServerMessage = async (serverResponse) => {
        const message = serverResponse.message;
        console.log("Message returned from server: ", message);

        const audioURL = await handleAudioResponse(message.content);
        setAudioLog((prevAudioLog) => [...prevAudioLog, { message: message.content, audioURL }]);

        audioCache.set(message.content, audioURL);

        setMessageLog((prevMessageLog) => [...prevMessageLog, message]);
        setIsLoading(false);
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter") handleSendMessage();
    };

    const handlePlayAudio = async (text) => {
        if (audioCache.has(text)) {
            const cachedAudioURL = audioCache.get(text);
            const audio = new Audio(cachedAudioURL);
            audio.play();
        } else {
            const audioURL = await generateSpeech(text);
            audioCache.set(text, audioURL);
            const audio = new Audio(audioURL);
            audio.play();
        }
    };

    return (
        <div className="ollama-chat">
            <h1>Ollama Chat</h1>

            <div className="chat-container">
                {messageLog
                    .filter((msg) => msg.role !== "system")
                    .map((msg, index) => (
                        <div key={index} className={`message ${msg.role}`}>
                            <strong>{msg.role === "assistant" ? character.name : msg.role}:</strong> {msg.content}
                            {msg.role === "assistant" && (
                                <button onClick={() => handlePlayAudio(msg.content)}>Play Message</button>
                            )}
                        </div>
                    ))}
            </div>

            <div className="input-container">
                <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={isLoading ? "awaiting response..." : "Type your message here..."}
                    disabled={isLoading}
                />
                <button onClick={handleSendMessage} disabled={isLoading}>Send</button>
            </div>

            <div className="audio-log">
                {audioLog.map((entry, index) => (
                    <div key={index} className="audio-entry">
                        <p>{index + 1}: {entry.message}</p>
                        <audio src={entry.audioURL} controls />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OllamaChat;