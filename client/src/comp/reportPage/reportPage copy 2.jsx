import React, { useState, useContext } from "react";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import { useReportLogic, exampleEvaluation, exampleChatLog } from "./reportLogic";
import ReportPDF from "./pdf.js";
import { Context } from "../../App.jsx";
import "./reportPageStyle.css";

const ReportPage = (props) => {
  const InfoObject = useContext(Context);
  const [messageLog] = InfoObject.chatlog;
  const [, setSimState] = InfoObject.simState;
  const [chosenScenario] = InfoObject.scenario;

  const [pdfData, setPdfData] = useState(null);
  const [generatingPDF, setGeneratingPDF] = useState(false);

  const { callOllamaFeedback } = useReportLogic(props);

  const getFeedback = async () => {
    setGeneratingPDF(true);
    const feedbackPromise = await callOllamaFeedback(messageLog);
    const response = feedbackPromise.response;
    setGeneratingPDF(false);

    setPdfData({
      feedback: response === "" ? exampleEvaluation : response,
      chatLog: !messageLog || messageLog.length === 1 ? exampleChatLog : messageLog,
    });
  };

  return (
    <div className="report-box">
      <h1>Rapport</h1>
      <button onClick={getFeedback} disabled={generatingPDF}>
        {generatingPDF ? "Genererer..." : "Generer tilbakemelding"}
      </button>

      {pdfData && pdfData.chatLog && pdfData.feedback && (
  <>
    <PDFViewer id="pdfViewer" style={{ width: "100%", height: "500px" }}>
      <ReportPDF feedback={pdfData.feedback} chatLog={pdfData.chatLog} />
    </PDFViewer>

    <PDFDownloadLink
      fileName={`Rapport_samtale_med_${chosenScenario?.name}_${new Date().toLocaleDateString()}.pdf`}
      document={<ReportPDF feedback={pdfData.feedback} chatLog={pdfData.chatLog} />}
    >
      {({ loading }) => (
        <button id="downloadPDF">
          {loading ? "Genererer dokument..." : "Last ned PDF"}
        </button>
      )}
    </PDFDownloadLink>
  </>
)}


      <br />
      <br />
      <button onClick={() => setSimState("")}>Tilbake Hjem</button>
    </div>
  );
};

export default ReportPage;