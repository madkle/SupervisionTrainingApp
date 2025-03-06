import "./App.css";
import React, { useState } from "react";
import HomePage from "./comp/mainPage/homePage.jsx";
export const Context = React.createContext();
function App() {
  const [language, setLanguage] = useState("norwegian");
  //const selectedInitialData = language === "norwegian" ? standardData.norwegian : standardData.english;

  //const initialMessageLog = selectedInitialData;
  const [messageLog, setMessageLog] = useState(/*initialMessageLog*/);
  const [useAudio, setUseAudio] = useState(false);
  //const [audioLog, setAudioLog] = useState(initialAudioLog);
  const [isSimRunning, setSimRunning] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [chosenScenario, setChosenScenario] = useState(/*standardScenario*/);
  const [simState, setSimState] = useState("");
  const InfoObject = {
    language: [language, setLanguage],
    scenario: [chosenScenario, setChosenScenario],
    chatlog: [messageLog, setMessageLog],
    feedback: [feedback, setFeedback],
    generateAudio: [useAudio, setUseAudio],
    simRunning: [isSimRunning, setSimRunning],
    simState: [simState, setSimState],
  };
  return (
    <Context.Provider value={InfoObject}>
      <div className="App">
        {/*  
        <header className="App-header">
          <button onClick={toggleTesting}>T</button>
        </header>
        */}
        <main className="App-main">
          <HomePage />
        </main>
      </div>
    </Context.Provider>
  );
}

export default App;
