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
  const [mostRecentReply, setMostRecentReply] = useState("");
  const [sessionState, setSessionState] = useState("notRecording");
  const [simState, setSimState] = InfoObject.simState;
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
    setSessionState("recording");
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
        setSessionState("waiting");
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
      setSessionState("notRecording");
      console.error("Error accessing microphone:", error);
    }
  };
  const handleChat = async () => {
    if (transcription !== "") {
      try {
        const message = transcription;
        const model = "llama3.1";
        //adding user message to the log
        const updatedLog = [...messageLog, { role: "user", content: message }];

        //calling the chat endpoint to get a response
        const AIResponse = await callChatAPI(updatedLog, model);

        //isolating the message from the response
        const ServerMessage = AIResponse.message;

        //setting the content of the response to be shown on the app
        setMostRecentReply(ServerMessage.content);

        //adding the response to the message log to be set to the context
        const updatedLogWithAI = [...updatedLog, ServerMessage];

        const audioURL = await handleAudioResponse(
          ServerMessage.content,
          AIVoice
        );
        setAudioLog([
          ...audioLog,
          { url: audioURL, text: ServerMessage.content },
        ]);

        //finished with the response, updating the global log
        setIsWaitingForServer(false);
        setSessionState("notRecording");
        setMessageLog(updatedLogWithAI);

        //clearing the transcription for later
        transcription = "";
      } catch (error) {
        console.error("Error handling server message: " + error);
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state === "recording") {
      mediaRecorder.current.stop();
      setIsRecording(false);
      setSessionState("notRecording");
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
    mostRecentReply,
    sessionState,
    setSessionState,
    messageLog,
    setSimState,
  };
};
