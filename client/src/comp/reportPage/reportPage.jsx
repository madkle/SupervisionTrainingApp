import React, { useState, useContext } from "react";
import {
  useReportLogic,
  exampleChatLog,
  exampleEvaluation,
} from "./reportLogic";
import Evaluation from "./evaluation.jsx";
import Transcription from "./transcription.jsx";

import TestReport from "./test.jsx";
import "./reportPageStyle.css";

import { Context } from "../../App.jsx";
const ReportPage = (props) => {
  const InfoObject = useContext(Context);
  const [messageLog] = InfoObject.chatlog;
  const [feedback, setFeedback] = InfoObject.feedback;

  const [feedbackModule, setFeedbackModule] = useState(
    <Evaluation response={feedback} />
  );

  const { callOllamaFeedback } = useReportLogic(props);
  
  const getFeedback = async () => {
    const feedbackPromise = await callOllamaFeedback(messageLog);
    const response = feedbackPromise.response;
    setFeedbackModule(<Evaluation response={response} />);
    setFeedback(response);
  };

  return (
    <div className="report-box">
      <h1>Report</h1>
      <section>
        <h2>Transcript</h2>
        <Transcription response={messageLog} />
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
