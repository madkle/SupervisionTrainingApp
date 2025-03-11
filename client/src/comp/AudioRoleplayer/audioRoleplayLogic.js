import { useRef, useState, useContext } from "react";
import { handleSpeechToText } from "../functionality/speechToText.js";
import { callChatAPI } from "../functionality/ollamaChat.js";
import { handleAudioResponse } from "../functionality/audioHanlder.js";

import { Context } from "../../App.jsx";
export const useAudioChatLogic = (props) => {
  const InfoObject = useContext(Context);
  const [messageLog, setMessageLog] = InfoObject.chatlog;
  const [chosenScenario] = InfoObject.scenario;
  const [mostRecentReply, setMostRecentReply] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [sessionState, setSessionState] = useState("notRecording");
  const [simState, setSimState] = InfoObject.simState;

  // Audio recorders
  const mediaStream = useRef(null);
  const audioContext = useRef(null);
  const analyser = useRef(null);
  const mediaRecorder = useRef(null);
  const chunks = useRef([]);
  const [audioLog, setAudioLog] = useState([]);

  let transcription = "";
  const AIVoice = chosenScenario.voice;

  // **FUNKSJON FOR Å SJEKKE OM LYDFILEN INNEHOLDER LYD**
  const checkIfSilent = async (blob) => {
    return new Promise((resolve) => {
      try {
        const audioContext = new AudioContext();
        const reader = new FileReader();

        reader.onload = async () => {
          try {
            const arrayBuffer = reader.result;
            const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

            const rawData = audioBuffer.getChannelData(0); // Første kanal
            const sum = rawData.reduce((acc, value) => acc + Math.abs(value), 0);
            const averageAmplitude = sum / rawData.length;
            const silenceThreshold = 0.01; // Juster terskelen etter behov

            resolve(averageAmplitude < silenceThreshold);
          } catch (error) {
            console.error("Feil ved lydprosessering:", error);
            setErrorMessage("Kunne ikke analysere lydfilen.");
            resolve(false); // Antar at det ikke er stillhet hvis en feil oppstår
          }
        };

        reader.readAsArrayBuffer(blob);
      } catch (error) {
        console.error("Feil ved åpning av lydfil:", error);
        setErrorMessage("Kunne ikke åpne lydfilen.");
        resolve(false);
      }
    });
  };

  // **Start opptak**
  const startRecording = async () => {
    setSessionState("recording");
    setErrorMessage("");
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
        setSessionState("waiting");
        const recordedBlob = new Blob(chunks.current, { type: "audio/webm" });

        // **Sjekker om opptaket er kun stillhet**
        const isSilent = await checkIfSilent(recordedBlob);
        if (isSilent) {
          setErrorMessage("Mikrofonen tok bare opp stillhet. Prøv igjen!");
          setSessionState("notRecording");
          chunks.current = [];
          return;
        }

        try {
          transcription = await handleSpeechToText(recordedBlob, "whisper-1");
          handleChat();
        } catch (error) {
          console.error("Feil ved transkripsjon:", error);
          setErrorMessage("Kunne ikke transkribere lydopptaket.");
        }

        chunks.current = [];
      };

      mediaRecorder.current.start();
    } catch (error) {
      setSessionState("notRecording");
      console.error("Feil ved tilgang til mikrofon:", error);
      setErrorMessage("Kunne ikke få tilgang til mikrofonen. Sjekk tillatelser.");
    }
  };

  // **Håndter chat-logikk**
  const handleChat = async () => {
    if (transcription !== "") {
      try {
        const message = transcription;
        const model = "llama3.2";
        const updatedLog = [...messageLog, { role: "user", content: message }];
        
        try {
          const AIResponse = await callChatAPI(updatedLog, model);
          const ServerMessage = AIResponse.message;

          setMostRecentReply(ServerMessage.content);
          const updatedLogWithAI = [...updatedLog, ServerMessage];

          try {
            const audioURL = await handleAudioResponse(ServerMessage.content, AIVoice);
            setAudioLog([...audioLog, { url: audioURL, text: ServerMessage.content }]);

            const newAudio = new Audio();
            newAudio.src = audioURL;
            newAudio.play();
            newAudio.addEventListener("ended", () => {
              setSessionState("notRecording");
            });
          } catch (error) {
            console.error("Feil ved generering av AI-lyd:", error);
            setErrorMessage("Kunne ikke generere AI-lyd.");
          }

          setMessageLog(updatedLogWithAI);
          transcription = "";
        } catch (error) {
          console.error("Feil ved AI-respons:", error);
          setErrorMessage("Kunne ikke hente svar fra AI.");
        }
      } catch (error) {
        console.error("Feil i chatlogikk:", error);
        setErrorMessage("Noe gikk galt under meldingshåndtering.");
      }
    }
  };

  // **Stopper opptaket manuelt**
  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state === "recording") {
      mediaRecorder.current.stop();
      setSessionState("notRecording");
    }
    if (mediaStream.current) {
      mediaStream.current.getTracks().forEach((track) => track.stop());
    }
  };

  return {
    startRecording,
    stopRecording,
    mostRecentReply,
    sessionState,
    messageLog,
    setSimState,
    chosenScenario,
    errorMessage
  };
};
