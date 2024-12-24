import React, { useState } from "react";
import "../styling/supervisionSim.css";
import OllamaChat from "./chat";



const SupervisionSimulation = () => {
    
  return (
    <main id="mainWindow">
      
      <h2>Simulation Started!</h2>
      <OllamaChat />
      
    </main>
  );
};
export default SupervisionSimulation;
