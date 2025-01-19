import React, { useState } from "react";
import "./supervisionSim.css";
import OllamaChat from "../TextRoleplayer/chat";
import AudioRoleplayer from "../AudioRoleplayer/audioRoleplay";

const SupervisionSimulation = (props) => {
  return (
    <section id="mainWindow">
      {props.chatType === "text" ? (
        <OllamaChat language={props.language} useNewChat={props.useSavedChat} />
      ) : (
        <AudioRoleplayer language={props.language} />
      )}
    </section>
  );
};
export default SupervisionSimulation;
