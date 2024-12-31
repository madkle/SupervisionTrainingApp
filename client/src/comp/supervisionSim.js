import React, { useState } from "react";
import "../styling/supervisionSim.css";
import OllamaChat from "./chat";
import AudioRecorder from "./audioRecorder";


const SupervisionSimulation = () => {
    
  return (
    <main id="mainWindow">
      
      <h2>Simulation Started!</h2>
      <AudioRecorder/>
      <OllamaChat />
      
    </main>
  );
};
export default SupervisionSimulation;
