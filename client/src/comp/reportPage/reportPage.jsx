import React, { useState, useContext } from "react";
import { PDFViewer } from "@react-pdf/renderer";
import {
  useReportLogic,
  exampleEvaluation,
  exampleChatLog,
} from "./reportLogic";
import Evaluation from "./evaluation.jsx";
import Transcription from "./transcription.jsx";
import TestReport from "./test.jsx";
import "./reportPageStyle.css";
import ReportPDF from "./pdf.js";
import { Context } from "../../App.jsx";
const ReportPage = (props) => {
  const InfoObject = useContext(Context);
  const [messageLog] = InfoObject.chatlog;
  const [feedback, setFeedback] = InfoObject.feedback;
  const [simState, setSimState] = InfoObject.simState;

  const [feedbackModule, setFeedbackModule] = useState(
    <Evaluation response={feedback === "" ? exampleEvaluation : feedback} />
  );
  const [pdfSection, setPdfSection] = useState(<></>);
  const { callOllamaFeedback } = useReportLogic(props);

  const getFeedback = async () => {
    
    const feedbackPromise = await callOllamaFeedback(messageLog);
    const response = feedbackPromise.response;
    setFeedbackModule(<Evaluation response={response} />);
    setFeedback(response);
    console.log("feedback:");
    
    console.log(feedback);
    
    console.log("response");
    console.log(response);
    console.log("messageLog");
    console.log(messageLog);
    
    setPdfSection(
      <PDFViewer id="pdfViewer">
        <ReportPDF
          feedback={response === "" ? exampleEvaluation : response}
          chatLog={
            !messageLog || messageLog.lenght === 1 ? exampleChatLog : messageLog
          }
        />
      </PDFViewer>
    );
  };

  return (
    <div className="report-box">
      <h1>Report</h1>
    {/*  
      <section>
        <h2>Transcript</h2>
        <Transcription
          response={
            messageLog || messageLog.lenght === 1 ? exampleChatLog : messageLog
          }
        />
      </section>
      <section>
        <h2>Audio Recording</h2>
      </section>
      <section>
        <h2>Feedback</h2>
       
        {feedbackModule}
      </section>
*/}
 <button onClick={getFeedback}>Generer tilbakemelding</button>
      <section>{pdfSection}</section>
      {/*
      <section>
      <TestReport/>
      </section>*/}
      <br/>
      <button onClick={() => {
          setSimState("");
         
        }}>Tilbake Hjem</button>
    </div>
  );
};

export default ReportPage;
