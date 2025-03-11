import React, { useState, useContext, usePDF } from "react";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
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
  const [, setSimState] = InfoObject.simState;
  const [chosenScenario] = InfoObject.scenario;

  const [pdfSection, setPdfSection] = useState(<></>);
  const { callOllamaFeedback } = useReportLogic(props);
  const [generatingPDF, setGeneratingPDF] = useState(false);

  const getFeedback = async () => {
    setGeneratingPDF(true);
    const feedbackPromise = await callOllamaFeedback(messageLog);
    const response = feedbackPromise.response;
    setGeneratingPDF(false);
    const date = new Date();
    setPdfSection(
      <>
        <PDFViewer id="pdfViewer" >
          <ReportPDF
            feedback={response === "" ? exampleEvaluation : response}
            chatLog={
              !messageLog || messageLog.lenght === 1
                ? exampleChatLog
                : messageLog
            }
          />
        </PDFViewer>
        
        {/* 
        <button
          id="downoladPDF"
          onClick={() => {
            console.log("end");
          }}
        >
          <PDFDownloadLink
            fileName={`Rapport_samtale_med_${
              chosenScenario.name
            }_${date.getDate()}_${date.getMonth() + 1}`}
            document={
              <ReportPDF
                feedback={response === "" ? exampleEvaluation : response}
                chatLog={
                  !messageLog || messageLog.lenght === 1
                    ? exampleChatLog
                    : messageLog
                }
              />
            }
          >
            {({ blob, url, loading, error }) =>
              loading ? "genererer dokument..." : "Last ned"
            }
          </PDFDownloadLink>
        </button>*/}
      </>
    );
  };

  return (
    <div className="report-box">
      <h1>Rapport</h1>
      <button onClick={getFeedback}>Generer tilbakemelding</button>
      <section hidden={generatingPDF}>{pdfSection}</section>

      <section id="loaderContainer">
        <div className="loader" hidden={!generatingPDF}></div>
      </section>
      <br />
      <button
        onClick={() => {
          setSimState("");
        }}
      >
        Tilbake Hjem
      </button>
    </div>
  );
};

export default ReportPage;
