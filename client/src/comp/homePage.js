import React, { useState } from "react";
import "../styling/homePage.css";
import SupervisionSimulation from "./supervisionSim";
import WelcomeForm from "./welcomeForm";
import ToggleButton from "./button";

/*
-----------------------------------------------------
Change the true false states in the button!


----------------------------------------------------
*/
const NorwegianWarning = () => {
  return (
    <div
      style={{
        backgroundColor: "ivory",
        border: "1px solid black",
        borderRadius: "5px",
      }}
    >
      <h3>OBS!</h3>
      <p>KI-modellen er ikke veldig god på norsk.</p>
      <p>Rollespillet kan ha litt rar norsk dialog.</p>
      <p>Hvis dette ikke er et problem, kan du fortsette.</p>
    </div>
  );
};
const HomePage = () => {
  const availableLanguages = ["Norwegian", "English"];
  const [language, setLanguage] = useState(availableLanguages[0]);

  return (
    <div id="homeContainer">
      <h1>Welcome to the simulation!</h1>
      <div
        style={{
          display: "flex",
          gap: "1rem",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p>Choose language</p>
        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
          {availableLanguages.map((lang) => (
            <option value={lang}>{lang}</option>
          ))}
        </select>
      </div>
      {language === "Norwegian" && <NorwegianWarning />}

      <ToggleButton
        falseState={{
          text: "Stop",
          component: <SupervisionSimulation language={language}/>,
        }}
        trueState={{
          text: "Start",
          component: <WelcomeForm />,
        }}
      />
    </div>
  );
};
export default HomePage;
