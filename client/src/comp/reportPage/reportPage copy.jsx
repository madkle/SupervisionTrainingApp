import React, { useState, useContext, useMemo } from "react";
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
  const [pdfError, setPdfError] = useState(null); // Ny state for feil

  const { callOllamaFeedback } = useReportLogic(props);

  const getFeedback = async () => {
    setGeneratingPDF(true);
    setPdfError(null); // Nullstill feilen ved ny generering

    try {
      const feedbackPromise = await callOllamaFeedback(messageLog);
      const response = feedbackPromise.response;
      setGeneratingPDF(false);

      setPdfData({
        feedback: response === "" ? exampleEvaluation : response,
        chatLog: !messageLog || messageLog.length === 1 ? exampleChatLog : messageLog,
      });
    } catch (error) {
      setGeneratingPDF(false);
      setPdfError("Kunne ikke generere PDF. Prøv igjen.");
      console.error("Feil under generering av PDF:", error);
    }
  };

  // Memoiser PDF-dokumentet for å unngå re-renders
  const pdfDocument = useMemo(() => {
    if (!pdfData || !pdfData.chatLog || !pdfData.feedback) return null;
    try {
      return <ReportPDF feedback={pdfData.feedback} chatLog={pdfData.chatLog} />;
    } catch (error) {
      setPdfError("Feil ved rendering av PDF.");
      console.error("PDF render error:", error);
      return null;
    }
  }, [pdfData]);

  return (
    <div className="report-box">
      <h1>Rapport</h1>
      <button onClick={getFeedback} disabled={generatingPDF} hidden={pdfDocument}>
        {generatingPDF ? "Genererer..." : "Generer tilbakemelding"}
      </button>

      {pdfError ? (
        <p className="error-message">{pdfError}</p>
      ) : pdfDocument ? (
        <>
          <PDFViewer id="pdfViewer" style={{ width: "100%", height: "500px" }}>
            {pdfDocument}
          </PDFViewer>

          <PDFDownloadLink
            fileName={`Rapport_samtale_med_${chosenScenario?.name}_${new Date().toLocaleDateString()}.pdf`}
            document={pdfDocument}
          >
            {({ loading }) => (
              <button id="downloadPDF">
                {loading ? "Genererer dokument..." : "Last ned PDF"}
              </button>
            )}
          </PDFDownloadLink>
        </>
      ) : (
        <p>Ingen PDF generert ennå.</p>
      )}

      <br />
      <br />
      <button onClick={() => setSimState("")}>Tilbake Hjem</button>
    </div>
  );
};

export default ReportPage;
