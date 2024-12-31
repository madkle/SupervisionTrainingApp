import React, { useRef, useState } from "react";

const AudioRecorder = () => {
  const [recordedAudios, setRecordedAudios] = useState([]); // Array to store audio URLs
  const mediaStream = useRef(null);
  const mediaRecorder = useRef(null);
  const chunks = useRef([]);
  const audioContext = useRef(null);
  const analyser = useRef(null);
  const silenceTimeout = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [useAutoStop, setUseAutoStop] = useState(false);
  const [silenceDuration, setSilenceDuration] = useState(3); // Default to 3 seconds

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

      mediaRecorder.current.onstop = () => {
        const recordedBlob = new Blob(chunks.current, { type: "audio/webm" });
        const url = URL.createObjectURL(recordedBlob);
        setRecordedAudios((prev) => [...prev, url]); // Add the audio URL to the array

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
            console.log(`Silence detected for ${silenceDuration} seconds, stopping recording.`);
            stopRecording();
          }, silenceDuration * 1000);
        }
      } else {
        clearTimeout(silenceTimeout.current);
        silenceTimeout.current = null;
      }

      if (mediaRecorder.current && mediaRecorder.current.state === "recording") {
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
        {recordedAudios.map((audioUrl, index) => (
          <div key={index}>
            <audio controls src={audioUrl}></audio>
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

      <button onClick={startRecording}>Start Recording</button>
      <button onClick={stopRecording}>Stop Recording</button>
      <div
        style={{
          margin: "16px 0",
          minHeight: "21px",
        }}
      >
        {isRecording ? <p>Recording in progress...</p> : <></>}
      </div>
    </div>
  );
};

export default AudioRecorder;
