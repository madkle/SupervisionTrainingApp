import React, { useState } from "react";
import "./supervisionSim.css";
import OllamaChat from "../TextRoleplayer/chat";
import AudioRoleplayer from "../AudioRoleplayer/audioRoleplay";
import ToggleButton from "../Button/button";

const SupervisionSimulation = (props) => {
  const [useVoiceChat, setUseVoiceChat] = useState(false);
  const toggleVoiceChat = () => {
    setUseVoiceChat(!useVoiceChat);
  };
 
  console.log(props.useSavedChat);
  
  return (
    <>
      

      <section id="mainWindow">
        <p>Toggle between text chat and audio chat:</p>
        <button onClick={toggleVoiceChat}>
          {useVoiceChat ? "Text Chat" : "Voice Chat"}
        </button>
        {useVoiceChat ? (
          <AudioRoleplayer language={props.language} />
        ) : (
          <OllamaChat language={props.language} useNewChat={props.useSavedChat} />
        )}
      </section>
    </>
  );
};
export default SupervisionSimulation;
