import React, { useContext, useState } from "react";
import { Context } from "../../App.jsx";
import standardAvatar from "./files/avatar.png";
import ScenarioCard from "./scenarioCard.jsx";
import "./welcomePage.css";

const WelcomePage = () => {
  const InfoObject = useContext(Context);
  const [language, setLanguage] = InfoObject.language;
  const [useAudio, setUseAudio] = InfoObject.generateAudio;

  return (
    <div>
      <h1>Velkommen</h1>
      
      {/* Scenario container */}
      <div id="scenarioContainer">
        <ScenarioCard avatar={standardAvatar} name={"Ola"} />
        <ScenarioCard avatar={standardAvatar} name={"Per"} />
      </div>
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
    </div>
  );
};

export default WelcomePage;
