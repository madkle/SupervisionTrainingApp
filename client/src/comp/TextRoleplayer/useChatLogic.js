import { useState, useContext } from "react";
import {
  callChatAPI,
  character,
  exampleData,
} from "../functionality/ollamaChat.js";
import { handleAudioResponse } from "../functionality/audioHanlder.js";
import { generateSpeech } from "../functionality/textToSpeech.js";
import { Context } from "../../App.jsx";
export const useChatLogic = (props) => {
  const InfoObject = useContext(Context);
  const [messageLog, setMessageLog] = InfoObject.chatlog;
  const [useAudio] = InfoObject.generateAudio;
  /*
  const initialAudioLog = useNewChat
    ? JSON.parse(localStorage.getItem("audioLog"))
    : [];

  const [audioLog, setAudioLog] = useState(initialAudioLog);*/

  const [inputMessage, setInputMessage] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const audioCache = useState(new Map())[0];

  const AIVoice = "alloy";
  const llmModel = ["llama3.1", "llama3.2"];


  const [savedMessage, setSavedMessage] = useState("");
  const handleSendMessage = async () => {
    setIsLoading(true);
    setInputMessage("");

    const updatedMessageLog = [
      ...messageLog,
      { role: "user", content: inputMessage },
    ];
    setMessageLog(updatedMessageLog);

    const serverResponse = await callChatAPI(updatedMessageLog, llmModel[0]);
    await handleServerMessage(serverResponse);
  };

  const handleServerMessage = async (serverResponse) => {
    const message = serverResponse.message;
    console.log("Message returned from server: ", message);
    if (useAudio) {
      const audioURL = await handleAudioResponse(message.content, AIVoice);
      /*
    setAudioLog((prevAudioLog) => [
      ...prevAudioLog,
      { message: message.content, audioURL },
    ]);
    */
      audioCache.set(message.content, audioURL);
    }

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
      const audioURL = await handleAudioResponse(text, AIVoice);
      audioCache.set(text, audioURL);
      const audio = new Audio(audioURL);
      audio.play();
    }
  };
  return {
    savedMessage,
    messageLog,
    //audioLog,
    inputMessage,
    isLoading,
    setSavedMessage,
    setInputMessage,
    handleSendMessage,
    handleKeyDown,
    handlePlayAudio,
  };
};
