import React, { useRef, useState } from "react";
import { handleSpeechToText } from "../functionality/speechToText.js";
import { callChatAPI, exampleData } from "../functionality/ollamaChat.js";
import { handleAudioResponse } from "../functionality/audioHanlder.js";
import standardAvatar from "./files/avatar.png";
import "./audioRoleplay.css";
import { useAudioChatLogic } from "./audioRoleplayLogic.js";
import micIcon from "./files/micIcon.svg";
const OldAudioRecorder = (props) => {
  const {
    setUseAutoStop,
    setSilenceDuration,
    startRecording,
    stopRecording,
    audioLog,
    recordedAudios,
    silenceDuration,
    useAutoStop,
    isRecording,
    isWaitingForServer,
  } = useAudioChatLogic(props);

  return (
    <div className="audio-recorder">
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
            <div key={`Audioresponse ${index}`}>
              <section style={{ display: "flex" }}>
                <p>{index}:</p>{" "}
                {audioLog.length === index + 1 ? (
                  <audio src={currentAudio.url} controls autoPlay />
                ) : (
                  <audio src={currentAudio.url} controls />
                )}
                <br />
              </section>
              <p>{currentAudio.text}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const AudioRecorder = (props) => {
  const {
    setUseAutoStop,
    setSilenceDuration,
    startRecording,
    stopRecording,
    audioLog,
    recordedAudios,
    silenceDuration,
    useAutoStop,
    isRecording,
    isWaitingForServer,
  } = useAudioChatLogic(props);
  const [isLoading, setIsLoading] = useState(false)
  return (
    <section id="audioContainer">
      <div style={{ display: "flex", flexDirection: "column" }}>
        
        
      </div>
      <div className="AudioGrid">
        <div id="micBtn" onClick={() => {
          setIsLoading(!isLoading)
        }}>
          {isLoading? <div class="loader"></div> : <img src={micIcon}></img>}
          
        </div>
        <div id="avatarContainer">
          <img src={standardAvatar}></img>
        </div>
        <div id="replyContainer" hidden={false}>
          <h1>Lærling:</h1>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolo
        </p>
        </div>
        <div id="endBtn">
          <button>Avslutt</button>
        </div>

      </div>
    </section>
  );
};
export default AudioRecorder;
