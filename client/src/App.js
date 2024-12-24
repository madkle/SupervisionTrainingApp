import "./App.css";
import React, { useState } from "react";
import TestingSuite from "./comp/testingSuite.js";
import HomePage from "./comp/homePage.js";
import ToggleButton from "./comp/button.js";
/*
-----------------------------------------------------
Change the true false states in the button!


----------------------------------------------------
*/
function App() {
  const [showTestingSuite, setShowTestingSuite] = useState(true);
  const toggleTesting = () => {
    setShowTestingSuite(!showTestingSuite);
  };
  return (
    <div className="App">
      <ToggleButton
        falseState={{
          text: "Toggle off Testing Suite",
          component: <TestingSuite />,
        }}
        trueState={{
          text: "Toggle on Testing Suite",
          component: <HomePage />,
        }}
      />
    </div>
  );
}

export default App;
