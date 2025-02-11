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
  const chatLogString = props.hasSavedChat
    ? localStorage.getItem("chatLog")
    : {};
  const isTesting = props.testing;
  const chatLog = !isTesting ? JSON.parse(chatLogString) : exampleChatLog;
  const locallyStoredFeedback = localStorage.getItem("feedback");
  let savedFeedback =
    locallyStoredFeedback !== null ? locallyStoredFeedback : "";
  if (isTesting) {
    savedFeedback = exampleEvaluation
  }
  const [feedbackModule, setFeedbackModule] = useState(
    <Evaluation response={savedFeedback} />
  );
  const { callOllamaFeedback } = useReportLogic(props);
  const getFeedback = async () => {
    const feedbackPromise = await callOllamaFeedback(chatLog);
    const response = feedbackPromise.response;
    setFeedbackModule(<Evaluation response={response} />);
    localStorage.setItem("feedback", response);
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
