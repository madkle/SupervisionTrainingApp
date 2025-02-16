import React, { useContext, useState } from "react";
import "./supervisionSim.css";
import { Context } from "../../App.jsx";
import TextChat from "../TextRoleplayer/OllamaChat.jsx";
import AudioRoleplayer from "../AudioRoleplayer/audioRoleplay";

const SupervisionSimulation = () => {
  const InfoObject = useContext(Context);
  const [language] = InfoObject.language;
  const [isSimRunning, setSimRunning] = InfoObject.simRunning;

  return (
    <>
      {/*
      <section>{isSimRunning && <TextChat language={language} />}</section>
      */}
      {isSimRunning && <AudioRoleplayer language={language} />}
    </>
  );
};
export default SupervisionSimulation;
