import React, { useRef, useState } from "react";

const AudioRecorder = () => {
  const [recordedAudios, setRecordedAudios] = useState([]); // Array to store audio URLs
  const mediaStream = useRef(null);
  const mediaRecorder = useRef(null);
  const chunks = useRef([]);
  const [isRecording, setIsRecording] = useState(false);

  const startRecording = async () => {
    setIsRecording(true)
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
        setRecordedAudios((prev) => [...prev, url]); // Add the audio URL to the array

        chunks.current = [];
      };

      mediaRecorder.current.start();
    } catch (error) {
        setIsRecording(false)
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state === "recording") {
      mediaRecorder.current.stop();
      setIsRecording(false)
    }
    if (mediaStream.current) {
      mediaStream.current.getTracks().forEach((track) => track.stop());
    }
  };

  return (
    <div>
      <h2>Available Recordings:</h2>
      <section>
        {recordedAudios.map((audioUrl, index) => (
          <div key={index}>
            <audio controls src={audioUrl}></audio>
          </div>
        ))}
      </section>

      <button onClick={startRecording}>Start Recording</button>
      <button onClick={stopRecording}>Stop Recording</button>
      <div
        style={{
          margin: "16px 0",
          minHeight: "21px",
        }}
      >
        {isRecording ? <p>Recodring in progress...</p> : <></>}
      </div>
    </div>
  );
};

export default AudioRecorder;
