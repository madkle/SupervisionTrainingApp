import React, { useState } from "react";
import "../styling/homePage.css";
import SupervisionSimulation from "./supervisionSim";
import WelcomeForm from "./welcomeForm";
import ToggleButton from "./button";

/*
-----------------------------------------------------
Change the true false states in the button!


----------------------------------------------------
*/
const HomePage = () => {
  
  return (
    <div id="homeContainer">
      <h1>Welcome to the simulation!</h1>
      <ToggleButton
        falseState={{
          text: "Start",
          component: <WelcomeForm />,
        }}
        trueState={{
          text: "Stop",
          component: <SupervisionSimulation />,
        }}
      />
      
    </div>
  );
};
export default HomePage;
