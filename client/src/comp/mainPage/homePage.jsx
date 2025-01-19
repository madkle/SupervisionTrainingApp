import React, { useState } from "react";
import "./homePage.css";
import SupervisionSimulation from "../SupervisionSim/supervisionSim";

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
  const [chatType, setChatType] = useState("text");
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);
  const [useSavedChat, setUseSavedChat] = useState(false);

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
        <label>
          <input
            type="checkbox"
            checked={useSavedChat}
            onChange={toggleSavedChat}
          />
          Use saved chat
        </label>
      </section>
    );
  };

  const ChatTypeSelector = () => {
    return (
      <div>
        <p>Choose chat type</p>
        <div>
          <label>
            <input
              type="radio"
              name="chatType"
              value="text"
              checked={chatType === "text"}
              onChange={() => setChatType("text")}
            />
            Text Chat
          </label>
          <label style={{ marginLeft: "1rem" }}>
            <input
              type="radio"
              name="chatType"
              value="voice"
              checked={chatType === "voice"}
              onChange={() => setChatType("voice")}
            />
            Voice Chat
          </label>
        </div>
      </div>
    );
  };

  const toggleSavedChat = () => {
    setUseSavedChat(!useSavedChat);
  };

  const changeState = () => {
    setButton(!toggle);
    setIsSimulationRunning(!toggle);
  };

  const hasSavedChat = localStorage.getItem("chatLog") !== null;

  return (
    <div id="homeContainer">
      <h1>Welcome to the simulation!</h1>
      {!isSimulationRunning && <LanguageSelector />}
      <br />
      {!isSimulationRunning && hasSavedChat && <LoadSavedChat />}
      <br />
      {!isSimulationRunning && <ChatTypeSelector />}
      {/* Space for character selector sometime */}

      {/* Space for character selector sometime */}
      <br />
      <button onClick={changeState}>{!toggle ? "Start" : "Stop"}</button>
      <br />
      {toggle && (
        <SupervisionSimulation
          language={language}
          useSavedChat={useSavedChat}
          chatType={chatType}
        />
      )}
    </div>
  );
};

export default HomePage;
