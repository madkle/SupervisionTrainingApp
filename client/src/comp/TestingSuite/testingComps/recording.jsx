import React, { useRef, useState } from "react";

const AudioRecorder = () => {
  const [recordedUrl, setRecordedUrl] = useState("");
  const mediaStream = useRef(null);
  const mediaRecorder = useRef(null);
  const chunks = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStream.current = stream;

      mediaRecorder.current = new MediaRecorder(stream);
      mediaRecorder.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.current.push(e.data);
        }
      };

      mediaRecorder.current.onstop = () => {
        const recordedBlob = new Blob(chunks.current, { type: "audio/webm" });
        const url = URL.createObjectURL(recordedBlob);
        setRecordedUrl(url);
        
        // Send the audio file to the server
        sendAudioToServer(recordedBlob);

        chunks.current = [];
      };

      mediaRecorder.current.start();
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state === "recording") {
      mediaRecorder.current.stop();
    }
    if (mediaStream.current) {
      mediaStream.current.getTracks().forEach((track) => track.stop());
    }
  };

  const sendAudioToServer = async (blob) => {
    const formData = new FormData();
    formData.append("file", blob, "recorded-audio.webm");

    try {
      const response = await fetch("http://localhost:5000/api/save-audio", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to save audio on the server.");
      }

      console.log("Audio file saved successfully on the server.");
    } catch (error) {
      console.error("Error sending audio to the server:", error);
    }
  };

  return (
    <div>
      {/*<audio controls src={recordedUrl} />*/}
      <button onClick={startRecording}>Start Recording</button>
      <button onClick={stopRecording}>Stop Recording</button>
    </div>
  );
};
 
export default AudioRecorder;
