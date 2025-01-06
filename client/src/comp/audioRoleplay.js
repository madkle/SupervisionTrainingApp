import React, { useRef, useState } from "react";
import { handleSpeechToText } from "./functionality/speechToText.js";
import { callChatAPI, exampleData } from "./functionality/ollamaChat.js";
import { handleAudioResponse } from "./functionality/audioHanlder.js";
const AudioRecorder = () => {
  const [messageLog, setMessageLog] = useState(exampleData);
  const [recordedAudios, setRecordedAudios] = useState([]); // Array to store audio URLs
  const mediaStream = useRef(null);
  const mediaRecorder = useRef(null);
  const chunks = useRef([]);
  const audioContext = useRef(null);
  const analyser = useRef(null);
  const silenceTimeout = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [useAutoStop, setUseAutoStop] = useState(false);
  const [isWaitingForServer, setIsWaitingForServer] = useState(false);
  const [silenceDuration, setSilenceDuration] = useState(3); // Default to 3 seconds
  let transcription = "";
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
    console.log(transcription);

    if (transcription !== "") {
      console.log("Transcription:", transcription);
      const message = transcription;
      const model = "llama3.1";

      const updatedMessageLog = [
        ...messageLog,
        {
          role: "user",
          content: message,
        },
      ];

      setMessageLog(updatedMessageLog);

      handleServerMessage(await callChatAPI(updatedMessageLog, model));
      transcription = "";
    }
  };

  const handleServerMessage = async (serverResponse) => {
    const message = serverResponse.message;
    console.log("Message returned from server: ", serverResponse);

    const audioURL = await handleAudioResponse(message.content);
    setAudioLog((prevAudioLog) => [
      ...prevAudioLog,
      { url: audioURL, text: message.content },
    ]);

    setMessageLog((prevMessageLog) => {
      const updatedMessageLog = [...prevMessageLog, message];
      setIsWaitingForServer(false);
      //console.log("Message log updated: ", updatedMessageLog);
      return updatedMessageLog;
    });
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

  const stopSilenceDetection = () => {
    clearTimeout(silenceTimeout.current);
    silenceTimeout.current = null;
    if (audioContext.current) {
      audioContext.current.close();
      audioContext.current = null;
    }
  };

  return (
    <div>
      <h2>Available Recordings:</h2>
      <section>
        {recordedAudios.map((currentAudio, index) => (
          <div key={index}>
            <audio controls src={currentAudio.url}></audio>
            <p>Transcription: {currentAudio.transcription}</p>
          </div>
        ))}
      </section>

      <div>
        <label>
          <input
            type="checkbox"
            checked={useAutoStop}
            onChange={(e) => setUseAutoStop(e.target.checked)}
          />
          Enable Automatic Stop
        </label>
        {useAutoStop && (
          <div>
            <label>
              Silence Duration (seconds):
              <input
                type="number"
                min="1"
                value={silenceDuration}
                onChange={(e) => setSilenceDuration(Number(e.target.value))}
              />
            </label>
          </div>
        )}
      </div>

      <button onClick={startRecording} disabled={isWaitingForServer}>
        Start Recording
      </button>
      <button onClick={stopRecording} disabled={isWaitingForServer}>
        Stop Recording
      </button>
      <div
        style={{
          margin: "16px 0",
          minHeight: "21px",
        }}
      >
        {isRecording ? <p>Recording in progress...</p> : <></>}
        {isWaitingForServer ? <p>Waiting for response...</p> : <></>}
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
          audioLog.map((currentAudio, index) => (
            <>
              <div key={`Audioresponse ${index}`} style={{ display: "flex" }}>
                <p>{index}:</p>{" "}
                {audioLog.length === index + 1 ? (
                  <audio src={currentAudio.url} controls autoPlay />
                ) : (
                  <audio src={currentAudio.url} controls />
                )}
                <br />
              </div>
              <p>{currentAudio.text}</p>
            </>
          ))
        )}
      </div>
    </div>
  );
};

export default AudioRecorder;
