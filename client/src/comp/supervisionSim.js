import React, { useState } from "react";
import "../styling/supervisionSim.css";
import OllamaChat from "./chat";
import AudioRoleplayer from "./audioRoleplay";
import ToggleButton from "./button";

const SupervisionSimulation = () => {
  return (
    <main id="mainWindow">
      <h2>Simulation Started!</h2>

      <ToggleButton
        falseState={{
          text: "Text Chat",
          component: <AudioRoleplayer />,
        }}
        trueState={{
          text: "Voice Chat",
          component: <OllamaChat />,
        }}
      />
    </main>
  );
};
export default SupervisionSimulation;
