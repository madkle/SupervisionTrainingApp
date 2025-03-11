import React from "react";
import standardAvatar from "./files/avatar.png";
import "./audioRoleplay.css";
import { useAudioChatLogic } from "./audioRoleplayLogic.js";
import micIcon from "../assets/micIcon.svg";

const AudioRecorder = (props) => {
  const {
    startRecording,
    stopRecording,
    mostRecentReply,
    sessionState,
    messageLog,
    setSimState,
    chosenScenario,
    errorMessage
  } = useAudioChatLogic(props);

  const recordingAction = () => {
    switch (sessionState) {
      case "recording":
        stopRecording();
        break;
      case "notRecording":
        startRecording();
        break;
      case "playing":
        break;
      default:
        break;
    }
  };
  const recordingButton = () => {
    let state = "";

    switch (sessionState) {
      case "recording":
        state = <div>Tar opp lyd. Klikk for å stoppe</div>;
        break;
      case "waiting":
        state = <div className="loader"></div>;
        break;
      case "playing":
        state = <div>Stop avspilling</div>;
        break;
      default:
        state = <img src={micIcon}></img>;
        break;
    }
    return state;
  };

  return (
    <>
      <section id="audioContainer">
        <div id="audioGrid">
          <div
            id="micBtn"
            onClick={() => {
              recordingAction();
            }}
          >
            {recordingButton()}
          </div>
          <div id="avatarContainer">
            <img className="avatar" src={standardAvatar} />
          </div>
          <div id="endBtn">
            <button
              onClick={() => {
                setSimState("report");
              }}
            >
              Avslutt
            </button>
          </div>
          <div id="replyContainer" className="popupBox"  hidden={!mostRecentReply}>
            {mostRecentReply ? (
              <>
                <h1>Lærling:</h1>
                <p>{mostRecentReply}</p>
              </>
            ) : (
              <></>
            )}
          </div>
          <div id="errorContainer" className="popupBox" hidden={!errorMessage}>
            {errorMessage ? (
              <>
                <h1>Det skjedde en feil!</h1>
                <p>{errorMessage}</p>
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
        <div id="transcript">
          {messageLog.map((chat, index) => {
            if (chat.role !== "system") {
              return (
                <div key={"chatline " + index} className="transcriptLine">
                  <div>
                    <span>
                      {chat.role === "user" ? "Veileder: " : "Lærling: "}
                    </span>
                    <span>{chat.content}</span>
                  </div>
                </div>
              );
            }
          })}
        </div>
      </section>
      <br />
      <section id="scenarioInfoCard">
        <h2>Samtale med {chosenScenario.name}</h2>
        <div>
            <h2>Beskrivelse</h2>
            <p id="scenarioDesc">{chosenScenario.description}</p>
        </div>
        {chosenScenario.guidingQuestions.length !== 0 ? (
          <div>
            <h2>Veiledende spørsmål:</h2>
            <div id="questionContainer">
              {chosenScenario.guidingQuestions.map((question, i) => {
                return (
                  <div key={"question: " + i} className="question">
                    <p>{`${i + 1}. ${question}`}</p>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <></>
        )}
      </section>
    </>
  );
};

export default AudioRecorder;
/*
      <section id="audioContainer">
        <div className="AudioGrid">
          <div
            id="micBtn"
            onClick={() => {
              recordingAction();
            }}
          >
            {recordingButton()}
          </div>

          <div id="avatarContainer">
            <img src={standardAvatar}></img>
          </div>
          <div id="replyContainer" hidden={!mostRecentReply}>
            {mostRecentReply ? (
              <>
                <h1>Lærling:</h1>
                <p>{mostRecentReply}</p>
              </>
            ) : (
              <></>
            )}
          </div>
          <div id="endBtn">
            <button>Avslutt</button>
          </div>
        </div>
        <div className="chat"></div>
      </section>
      <div>
        {audioLog.map((audio, index) => {
          return (
            <div key={"audioList " + index}>
              <p>{audio.text}</p>
              <audio src={audio.url} controls />
            </div>
          );
        })}
      </div> */
