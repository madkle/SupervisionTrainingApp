import React, { useContext, useState } from "react";
import { Context } from "../../App.jsx";
import standardAvatar from "./files/avatar.png";
import ScenarioCard from "./scenarioCard.jsx";
import "./welcomePage.css";

import { scenarioLogic } from "../scenario/scenarioLogic.js";
const WelcomePage = () => {
  const InfoObject = useContext(Context);
  const [language, setLanguage] = InfoObject.language;
  const [useAudio, setUseAudio] = InfoObject.generateAudio;
  const [messageLog, setMessageLog] = InfoObject.chatlog;
  const [scenario] = InfoObject.scenario;
  const [, setSimState] = InfoObject.simState;
  const { scenarioList } = scenarioLogic();
  return (
    <div>
      <h1>Velkommen</h1>
      <section id="scenarioContainer">
        {/* Scenario container */}
        {scenarioList.map((scenario, index) => {
          return (
            <ScenarioCard
              key={"Scenario " + (index + 1)}
              avatar={standardAvatar}
              scenario={scenario}
            />
          );
        })}
      </section>

      <br />
      <section id="buttonContainer">
        {!scenario ? (
          <p>Velg case før du kan starte</p>
        ) : (
          <>
            <button
              onClick={() => {
                setSimState("textChat");
                setMessageLog([
                  { role: "system", content: scenario.initialPrompt },
                ]);
              }}
              disabled={!scenario}
            >
              Start tekst samtale
            </button>
            <button
              onClick={() => {
                setSimState("voiceChat");
                setMessageLog([
                  { role: "system", content: scenario.initialPrompt },
                ]);
              }}
              disabled={!scenario}
            >
              Start stemme samtale
            </button>
          </>
        )}
      </section>
    </div>
  );
};

export default WelcomePage;
