import React, { useState } from "react";
import "./homePage.css";
import SupervisionSimulation from "../SupervisionSim/supervisionSim";
import ReportPage from "../reportPage/reportPage";
import { LogContext } from "../context/context.js";
import standardAvatar from "./files/avatar.png";
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
const OldPage = () => {
  const availableLanguages = ["norwegian", "english"];
  const [language, setLanguage] = useState(availableLanguages[0]);
  const [chatType, setChatType] = useState("text");
  const [isRunning, setisRunning] = useState(false);
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

  const changeRunningState = () => {
    setisRunning(!isRunning);
  };
  const hasSavedChat = localStorage.getItem("chatLog") !== null;

  return (
    <div id="homeContainer">
      <h1>Welcome to the simulation!</h1>
      {!isRunning && <LanguageSelector />}
      <br />
      {!isRunning && hasSavedChat && <LoadSavedChat />}
      <br />
      {!isRunning && <ChatTypeSelector />}

      <br />
      <button onClick={changeRunningState}>
        {!isRunning ? "Start" : "Stop"}
      </button>
      <br />
      {isRunning && (
        <SupervisionSimulation
          language={language}
          useSavedChat={useSavedChat}
          chatType={chatType}
        />
      )}
      <br />
      {!isRunning && hasSavedChat ? (
        <ReportPage hasSavedChat={hasSavedChat} testing={false} />
      ) : (
        <></>
      )}
    </div>
  );
};
const ScenarioCard = ({ avatar, name, personality, description }) => {
  return (
    <>
      <div className="scenarioCard visualize">
        <img src={avatar} className="avatarImage" alt="avatar image"></img>
        <div className=" avatarTextContainer">
          <div className="avatarTextRow ">
            <h2 className="">Navn: </h2>
            <p className="">{name || "No Data"}</p>
          </div>
          <div className="avatarTextRow">
            <h2>Personlighet</h2> <p>{personality || "No Data"}</p>
          </div>
          <div className="avatarTextRow">
            <h2>Beskrivelse</h2> <p>{description || "No Data"}</p>
          </div>
          <button>Velg Senario</button>
        </div>
      </div>
    </>
  );
};
const HomePage = () => {
  return (
    <div id="homeContainer">
      <h1>Velkommen</h1>
      <div id="scenarioContainer">
      <ScenarioCard avatar={standardAvatar} name={"Ola"} />
      
      <ScenarioCard avatar={standardAvatar} name={"Ola"} />
      <ScenarioCard avatar={standardAvatar} name={"Ola"} />

      </div>
      <br />
      {/*<OldPage />*/}
    </div>
  );
};

export default HomePage;
