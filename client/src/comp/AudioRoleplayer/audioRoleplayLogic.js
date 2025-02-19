import React, { useRef, useState, useContext } from "react";
import { handleSpeechToText } from "../functionality/speechToText.js";
import { callChatAPI, exampleData } from "../functionality/ollamaChat.js";
import { handleAudioResponse } from "../functionality/audioHanlder.js";

import { Context } from "../../App.jsx";
export const useAudioChatLogic = (props) => {
  const InfoObject = useContext(Context);
  const [messageLog, setMessageLog] = InfoObject.chatlog;
  const [chosenScenario] = InfoObject.scenario;
  const [recordedAudios, setRecordedAudios] = useState([]); // Array to store audio URLs
  const [isRecording, setIsRecording] = useState(false);
  const [isWaitingForServer, setIsWaitingForServer] = useState(false);
  const [mostRecentReply, setMostRecentReply] = useState("")
  //audio recorders
  const mediaStream = useRef(null);
  const audioContext = useRef(null);
  const analyser = useRef(null);
  const mediaRecorder = useRef(null);
  const chunks = useRef([]);

  //transcription
  let transcription = "";

  //globale vars for autostop
  const silenceTimeout = useRef(null);
  const [useAutoStop, setUseAutoStop] = useState(false);
  const [silenceDuration, setSilenceDuration] = useState(3); // Default to 3 seconds

  const AIVoice = chosenScenario.voice;

  //AUDIO
  const [audioLog, setAudioLog] = useState([]);

  const startRecording = async () => {
    setIsRecording(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStream.current = stream;

      // Initialize Web Audio API for silence detection
      audioContext.current = new AudioContext();
      const source = audioContext.current.createMediaStreamSource(stream);
      analyser.current = audioContext.current.createAnalyser();
      source.connect(analyser.current);
      analyser.current.fftSize = 256;

      mediaRecorder.current = new MediaRecorder(stream);
      mediaRecorder.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.current.push(e.data);
        }
      };

      mediaRecorder.current.onstop = async () => {
        setIsWaitingForServer(true);
        const recordedBlob = new Blob(chunks.current, { type: "audio/webm" });
        const url = URL.createObjectURL(recordedBlob);
        // Pass the Blob to the transcription function
        transcription = await handleSpeechToText(recordedBlob, "whisper-1");

        handleChat(); // Pass the updated value

        setRecordedAudios((prev) => [...prev, { url, transcription }]); // Add the audio URL to the array
        chunks.current = [];
        stopSilenceDetection();
      };

      mediaRecorder.current.start();
      if (useAutoStop) startSilenceDetection();
    } catch (error) {
      setIsRecording(false);
      console.error("Error accessing microphone:", error);
    }
  };
  const handleChat = async () => {
    if (transcription !== "") {
      const message = transcription;
      const model = "llama3.1";
      console.log("transcription: " + transcription);
      
      console.log("message log before handle server message:");
      console.log(messageLog);
      handleServerMessage(message, model);

      transcription = "";
    }
  };

  const handleServerMessage = async (message, model) => {
    try {
      const updatedLog = [...messageLog, { role: "user", content: message }];
      console.log("Message sent to server: ");
      console.log(updatedLog);
      const AIResponse = await callChatAPI(updatedLog, model);
      console.log("response from server");
      console.log(AIResponse);
      
      const ServerMessage = AIResponse.message;
      console.log("message from server:");
      console.log(ServerMessage);
      setMostRecentReply(ServerMessage.content)
      const updatedLogWithAI = [...updatedLog, ServerMessage]
      /*
      const audioURL = await handleAudioResponse(
        ServerMessage.content,
        AIVoice
      );
      setAudioLog([
        ...audioLog,
        { url: audioURL, text: ServerMessage.content },
      ]);
      */
      setIsWaitingForServer(false);
      console.log("What to send to message log");
      console.log(updatedLogWithAI);

      setMessageLog(updatedLogWithAI);
      
    } catch (error) {
      console.error("Error handling server message: " + error);
    }
  };
  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state === "recording") {
      mediaRecorder.current.stop();
      setIsRecording(false);
    }
    if (mediaStream.current) {
      mediaStream.current.getTracks().forEach((track) => track.stop());
    }
    stopSilenceDetection();
  };

  const startSilenceDetection = () => {
    const bufferLength = analyser.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const detectSilence = () => {
      analyser.current.getByteTimeDomainData(dataArray);

      const isSilent = dataArray.every((value) => Math.abs(value - 128) < 5); // Silence threshold

      if (isSilent) {
        if (!silenceTimeout.current) {
          silenceTimeout.current = setTimeout(() => {
            console.log(
              `Silence detected for ${silenceDuration} seconds, stopping recording.`
            );
            stopRecording();
          }, silenceDuration * 1000);
        }
      } else {
        clearTimeout(silenceTimeout.current);
        silenceTimeout.current = null;
      }

      if (
        mediaRecorder.current &&
        mediaRecorder.current.state === "recording"
      ) {
        requestAnimationFrame(detectSilence);
      }
    };

    detectSilence();
  };
  console.log("+-+-+-+-+-+-+-+-+-+-+-+-+");
  console.log("contant update of messagelog");
  console.log(messageLog);
  console.log("+-+-+-+-+-+-+-+-+-+-+-+-+");
  
  const stopSilenceDetection = () => {
    clearTimeout(silenceTimeout.current);
    silenceTimeout.current = null;
    if (audioContext.current) {
      audioContext.current.close();
      audioContext.current = null;
    }
  };

  return {
    recordedAudios,
    useAutoStop,
    setUseAutoStop,
    silenceDuration,
    setSilenceDuration,
    startRecording,
    isWaitingForServer,
    stopRecording,
    isRecording,
    audioLog,
    mostRecentReply
  };
};
