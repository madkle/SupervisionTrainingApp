import React, { useState } from "react";
import { useReportLogic, exampleChatLog , exampleEvaluation} from "./reportLogic";
import Evaluation from "./evaluation.jsx";
import Transcription from "./transcription.jsx";

import TestReport from "./test.jsx";
import "./reportPageStyle.css";
const ReportPage = (props) => {
  const [feedbackModule, setFeedbackModule] = useState(
    <Evaluation response={""} />
  );
  const { callOllamaFeedback } = useReportLogic(props);
  const getFeedback = async () => {
    const feedbackPromise = await callOllamaFeedback();
    const response = feedbackPromise.response;
    setFeedbackModule(<Evaluation response={response} />);
    console.log(feedbackPromise);
  };

  return (
    <div className="report-box">
      <h1>Report</h1>
      <section>
        <h2>Transcript</h2>
        <Transcription response={exampleChatLog} />
      </section>
      <section>
        <h2>Audio Recording</h2>
      </section>
      <section>
        <h2>Feedback</h2>
        <button onClick={getFeedback}>Test</button>
        {feedbackModule}
      </section>
      <section>
      <TestReport/>
      </section>
    </div>
  );
};

export default ReportPage;
