import React, { useState } from "react";
import "../styling/supervisionSim.css";
import OllamaChat from "./chat";
import AudioRoleplayer from "./audioRoleplay";
import ToggleButton from "./button";

const SupervisionSimulation = (props) => {
  const savedChat = localStorage.getItem("chatLog") === null;
  
  return (
    <>
      {savedChat && (
        <section>
          <h2>Continue last saved chat</h2>
          <button>Chat</button>
        </section>
      )}

      <section id="mainWindow">
        <p>Toggle between text chat and audio chat:</p>
        <ToggleButton
          falseState={{
            text: "Text Chat",
            component: (
              <AudioRoleplayer language={props.language}/>
            ),
          }}
          trueState={{
            text: "Voice Chat",
            component: <OllamaChat language={props.language}  newChat = {savedChat}/>,
          }}
        />
      </section>
    </>
  );
};
export default SupervisionSimulation;
