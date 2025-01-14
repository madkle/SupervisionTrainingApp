import React, { useState } from "react";
import "../styling/supervisionSim.css";
import OllamaChat from "./chat";
import AudioRoleplayer from "./audioRoleplay";
import ToggleButton from "./button";


const SupervisionSimulation = (ConversationLanguage) => {
  
  return (
    <>
      
      <section id="mainWindow">
        <p>Toggle between text chat and audio chat:</p>
        <ToggleButton
          falseState={{
            text: "Text Chat",
            component: <AudioRoleplayer language={ConversationLanguage} />,
          }}
          trueState={{
            text: "Voice Chat",
            component: <OllamaChat language={ConversationLanguage} />,
          }}
        />
      </section>
    </>
  );
};
export default SupervisionSimulation;
