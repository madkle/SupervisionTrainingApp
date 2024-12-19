import "./App.css";
import React, { useState } from "react";
import TestingSuite from "./comp/testingSuite.js";
import HomePage from "./comp/homePage.js";
import ToggleButton from "./comp/button.js";
function App() {
  const [showTestingSuite, setShowTestingSuite] = useState(false);
  const toggleTesting = () => {
    setShowTestingSuite(!showTestingSuite);
  };
  return (
    <div className="App">
      <ToggleButton
        trueState={{
          text: "Toggle off Testing Suite",
          component: <TestingSuite />,
        }}
        falseState={{
          text: "Toggle on Testing Suite",
          component: <HomePage />,
        }}
      />
    </div>
  );
}

export default App;
