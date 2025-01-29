import React, { useState } from "react";
import {
  useReportLogic,
  exampleChatLog,
  exampleEvaluation,
} from "./reportLogic";
import Evaluation from "./evaluation.jsx";
import Transcription from "./transcription.jsx";

import TestReport from "./test.jsx";
import "./reportPageStyle.css";
const ReportPage = (props) => {
    const chatLogString = props.hasSavedChat ? localStorage.getItem("chatLog"): {};
    const chatLog = JSON.parse(chatLogString)
    const locallyStoredFeedback = localStorage.getItem("feedback");
  const savedFeedback = locallyStoredFeedback !== null ?  locallyStoredFeedback : ""
  const [feedbackModule, setFeedbackModule] = useState(
    <Evaluation response={savedFeedback} />
  );
  const { callOllamaFeedback } = useReportLogic(props);
  const getFeedback = async () => {
    
    const feedbackPromise = await callOllamaFeedback();
    const response = feedbackPromise.response;
    setFeedbackModule(<Evaluation response={response} />);
    localStorage.setItem("feedback", response)
    console.log(feedbackPromise);
  };
  
  return (
    <div className="report-box">
      <h1>Report</h1>
      <section>
        <h2>Transcript</h2>
        <Transcription response={chatLog} />
      </section>
      <section>
        <h2>Audio Recording</h2>
      </section>
      <section>
        <h2>Feedback</h2>
        <button onClick={getFeedback}>Generer tilbakemelding</button>
        {feedbackModule}
      </section>
      {/*
      <section>
      <TestReport/>
      </section>*/}
    </div>
  );
};

export default ReportPage;
