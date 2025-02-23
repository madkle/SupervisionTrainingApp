import React, { useContext } from "react";
import "./homePage.css";
import SupervisionSimulation from "../SupervisionSim/supervisionSim.jsx";
import ReportPage from "../reportPage/reportPage";
import WelcomePage from "../WelcomePage/welcomePage.jsx";
import { Context } from "../../App.jsx";
const HomePage = () => {
  const InfoObject = useContext(Context);
  const [isSimRunning, setSimRunning] = InfoObject.simRunning;

  return (
    <div id="homeContainer">
      {!isSimRunning && <WelcomePage />}
      <button
        onClick={() => {
          setSimRunning(!isSimRunning);
        }}
      >
        {isSimRunning ? "Stop" : "Start"} Text Chat
      </button>
      {isSimRunning && <SupervisionSimulation />}

      <br />
     
      
      {<ReportPage />} 
    </div>
  );
};

export default HomePage;
