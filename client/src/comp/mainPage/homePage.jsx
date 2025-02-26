import React, { useState, useContext } from "react";
import "./homePage.css";
import { Context } from "../../App.jsx";
import TextChat from "../TextRoleplayer/OllamaChat.jsx";
import AudioRoleplayer from "../AudioRoleplayer/audioRoleplay";
import ReportPage from "../reportPage/reportPage";
import WelcomePage from "../WelcomePage/welcomePage.jsx";
const HomePage = () => {
  const InfoObject = useContext(Context);
  const [language] = InfoObject.language;
  const [simState] = InfoObject.simState;
  const displaySim = (state) => {
    switch (state) {
      case "textChat":
        return <TextChat language={language} />;

      case "voiceChat":
        return <AudioRoleplayer language={language} />;

      case "report":
        return <ReportPage />;

      default:
        return <WelcomePage />;
    }
  };
  return (
    <div id="homeContainer">
      <section> {displaySim(simState)}</section>
    </div>
  );
};

export default HomePage;
