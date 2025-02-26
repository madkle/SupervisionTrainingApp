import React, { useContext, useState } from "react";
import "./supervisionSim.css";
import { Context } from "../../App.jsx";
import TextChat from "../TextRoleplayer/OllamaChat.jsx";
import AudioRoleplayer from "../AudioRoleplayer/audioRoleplay";
import ReportPage from "../reportPage/reportPage";

import WelcomePage from "../WelcomePage/welcomePage.jsx";
const SupervisionSimulation = () => {
  const InfoObject = useContext(Context);
  const [language] = InfoObject.language;
  const simState = "text";
  const displaySim = () => {
    switch (simState) {
      case "textChat":
        return <TextChat language={language} />;
        break;
      case "voiceChat":
        return <AudioRoleplayer language={language} />;
        break;
      case "report":
        return <ReportPage />;
        break;
      default:
        return <WelcomePage />;
        break;
    }
  };
  return (
    <>
      <section> {displaySim()}</section>
      {/*
      <AudioRoleplayer language={language} /> */}
    </>
  );
};
export default SupervisionSimulation;
