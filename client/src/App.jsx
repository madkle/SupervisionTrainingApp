import "./App.css";
import React, { useState } from "react";
import TestingSuite from "./comp/TestingSuite/testingSuite.jsx";
import HomePage from "./comp/mainPage/homePage.jsx";

function App() {
  const [showTestingSuite, setShowTestingSuite] = useState(false);
  const toggleTesting = () => {
    setShowTestingSuite(!showTestingSuite);
  };
  return (
    <div className="App">
      <header className="App-header">
        <button onClick={toggleTesting}>T</button>
      </header>
      <main className="App-main">{showTestingSuite ? <TestingSuite /> : <HomePage />}</main>
    </div>
  );
}

export default App;