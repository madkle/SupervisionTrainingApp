import React, { useState } from "react";
import "./supervisionSim.css";
import TextChat from "../TextRoleplayer/OllamaChat.jsx";
import AudioRoleplayer from "../AudioRoleplayer/audioRoleplay";

const SupervisionSimulation = (props) => {
  return (
    <section id="mainWindow">
      {props.chatType === "text" ? (
        <TextChat language={props.language} useNewChat={props.useSavedChat} />
      ) : (
        <AudioRoleplayer language={props.language} />
      )}
    </section>
  );
};
export default SupervisionSimulation;
