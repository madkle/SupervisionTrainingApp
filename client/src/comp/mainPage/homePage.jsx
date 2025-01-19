import React, { useState } from "react";
import "./homePage.css";
import SupervisionSimulation from "../SupervisionSim/supervisionSim";

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
  const availableLanguages = ["norwegian", "english"];
  const [language, setLanguage] = useState(availableLanguages[0]);
  const [toggle, setButton] = useState(false);
  const [useTextChat, setuseTextChat] = useState(false);
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);

  const [useSavedChat, setUseSavedChat] = useState(false);
  const changeState = () => {
    setButton(!toggle);
    setIsSimulationRunning(!toggle);
  };
  const LanguageSelector = () => {
    return (
      <>
        <div
          style={{
            display: "flex",
            gap: "1rem",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <p>Choose language</p>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            {availableLanguages.map((lang, i) => (
              <option key={"language" + i} value={lang}>
                {lang.charAt(0).toUpperCase() + lang.slice(1)}
              </option>
            ))}
          </select>
        </div>
        {language === "norwegian" && <NorwegianWarning />}
      </>
    );
  };
  const LoadSavedChat = () => {
    return (
      <section>
        <p>Continue last saved chat</p>
        <button onClick={toggleSavedChat}>Continue</button>

        {useSavedChat && <p>Using Saved Chat</p>}
      </section>
    );
  };
  const TextChatToggle = () => {
    const toggleChatType = () => {
      setuseTextChat(!useTextChat);
    };
    return (
      <div>
        <p>Choose chat type</p>
        <button onClick={toggleChatType}>
          {useTextChat ? "Text Chat" : "Voice Chat"}
        </button>
      </div>
    );
  };
  const toggleSavedChat = () => {
    setUseSavedChat(!useSavedChat);
  };
  const noSavedChat = localStorage.getItem("chatLog") === null;
  return (
    <div id="homeContainer">
      <h1>Welcome to the simulation!</h1>
      {!isSimulationRunning && <LanguageSelector />}
      <br />
      {!isSimulationRunning && !noSavedChat && <LoadSavedChat />}
      <br />
      <TextChatToggle />
      <br />
      <button onClick={changeState}>{!toggle ? "Start" : "Stop"}</button>
      <br />

      {toggle && (
        <SupervisionSimulation
          language={language}
          useSavedChat={useSavedChat}
        />
      )}
    </div>
  );
};
export default HomePage;
