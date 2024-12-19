import React, { useState } from "react";
import "../styling/homePage.css";
import SupervisionSimulation from "./welcomeForm";
import ToggleButton from "./button";

const HomePage = () => {
  
  const WelcomeForm = () => {
    return (
      <>
        <h2>Start simulation</h2>
      </>
    );
  };
  const test = {
    name: "trueState",
    reactComp: <WelcomeForm />,
  };
  return (
    <div id="homeContainer">
      <h1>Welcome to the simulation!</h1>
      <ToggleButton
        trueState={{
          text: "Start",
          component: <WelcomeForm />,
        }}
        falseState={{
          text: "Stop",
          component:<SupervisionSimulation />
        }}
      />
      <main id="mainWindow"></main>
    </div>
  );
};
export default HomePage;
