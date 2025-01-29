import React from "react";
import { rep } from "./exampeReports.js";
import Evaluation from "./evaluation.jsx";
const TestReport = () => {
  return (
    <div id="transcript-container">
      <h1>Eksempler</h1>
      {rep.map((item, index) => {
        return (
          <div key={"eval " + index} >
          <h2>Eksemepel: {index+1}</h2>
            <Evaluation response={item.response} />
          </div>
        );
      })}
      <Evaluation response={rep[0].response} />
    </div>
  );
};

export default TestReport;
