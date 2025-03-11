import React, { useState } from "react";
import { useChatLogic } from "./useChatLogic";
import "./chatBox.css";
import scenarioLogic from "../scenario/scenarioLogic.js";
import playIcon from "../assets/playSolid.svg";
import test from "../assets/micIcon.svg";
const TextChat = (props) => {
  const {
    savedMessage,
    messageLog,
    inputMessage,
    //audioLog,
    isLoading,
    setInputMessage,
    handleSendMessage,
    handleKeyDown,
    handlePlayAudio,
    setSimState,
    chosenScenario,
    isGeneratingAudio,
  } = useChatLogic(props);

  return (
    <>
      <div className="ollama-chat">
        <h1>Samtale med {chosenScenario.name}</h1>

        <div className="chat-container">
          {messageLog !== null &&
            messageLog
              .filter((msg) => msg.role !== "system")
              .map((msg, index) => (
                <div key={index} className={`message ${msg.role}`}>
                  <p>
                    <strong>
                      {msg.role === "assistant" ? chosenScenario.name : "Deg"}:
                    </strong>{" "}
                    {msg.content}
                  </p>

                  {msg.role === "assistant" && (
                    <button
                      className="playBtn"
                      onClick={() => handlePlayAudio(msg.content)}
                    >
                      {isGeneratingAudio ? (
                        <div className="loader"></div>
                      ) : (
                        <img
                          src={playIcon}
                          alt="play Icon"
                          className="playIcon"
                        />
                      )}
                    </button>
                  )}
                </div>
              ))}
        </div>

        <div className="input-container">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              isLoading ? "Awaiting response..." : "Type your message here..."
            }
            disabled={isLoading}
          />
          <button onClick={handleSendMessage} disabled={isLoading}>
            Send
          </button>
        </div>
        <br />
        <button
          onClick={() => {
            setSimState("report");
          }}
        >
          Avslutt
        </button>
      </div>
      <br/>
      <section id="scenarioInfoCardChat">
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

export default TextChat;
