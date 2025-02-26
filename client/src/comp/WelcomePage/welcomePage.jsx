import React, { useContext, useState } from "react";
import { Context } from "../../App.jsx";
import standardAvatar from "./files/avatar.png";
import ScenarioCard from "./scenarioCard.jsx";
import "./welcomePage.css";

import {scenarioLogic} from "../scenario/scenarioLogic.js";
const WelcomePage = () => {
  const InfoObject = useContext(Context);
  const [language, setLanguage] = InfoObject.language;
  const [useAudio, setUseAudio] = InfoObject.generateAudio;
  const [messageLog, setMessageLog] = InfoObject.chatlog;
  const [scenario] = InfoObject.scenario;
  const [, setSimState] = InfoObject.simState;
   const {
    scenarioList,
    } = scenarioLogic();
  return (
    <div>
      <h1>Velkommen</h1>
      
      {/* Scenario container */}
      <div id="scenarioContainer">
        {scenarioList.map((scenario,index)=>{
          
        return <ScenarioCard key={"Scenario " + (index+1)} avatar={standardAvatar} scenario={scenario} />

        })}
        {/* 
        <ScenarioCard avatar={standardAvatar} name={"Ola"} />
        <ScenarioCard avatar={standardAvatar} name={"Per"} />*/}
      </div>
      <br/>
      {/* Language container */}
      <div>
        <section id="languageContainer">
          <div className="languageSelector">
            <p>Choose language</p>
            <select
              value={language}
              onChange={(e) => {
                setLanguage(e.target.value);
              }}
            >
              <option value={"norwegian"}>Norwegian</option>
              <option value={"english"}>English</option>
            </select>
          </div>
          
      {/* Language warning */}
          <div style={{ minWidth: "361px", minHeight: "185px" }}>
            {language === "norwegian" && (
              <div className="warningBox">
                <h3>OBS!</h3>
                <p>KI-modellen er ikke veldig god på norsk.</p>
                <p>Rollespillet kan ha litt rar norsk dialog.</p>
                <p>Hvis dette ikke er et problem, kan du fortsette.</p>
              </div>
            )}
          </div>
        </section>
            
      <br/>
      {/* selections container */}
        <section>
          <label>
            <input
              type="checkbox"
              checked={useAudio}
              onChange={() => {
                setUseAudio(!useAudio);
              }}
            />
            Generate Text to Speech automatically
          </label>
        </section>
      </div>
      <br/>
      {!scenario ? (
        <p>Velg Scenario</p>
      ) : (<>
        <button
          onClick={() => {
            setSimState("textChat");
            setMessageLog([
              { role: "system", content: scenario.initialPrompt },
            ]);
          }}
          disabled={!scenario}
        >
          Start Text Chat
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
        Start Voice Chat
      </button></>
      )}
     
    </div>
  );
};

export default WelcomePage;
