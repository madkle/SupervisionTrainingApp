import React, { useState, useContext, use } from "react";
import { PDFDownloadLink, pdf } from "@react-pdf/renderer";
import ReportPDF from "./pdf.js";
import { Context } from "../../App.jsx";
import Transcription from "./transcription.jsx"; // Importer din nye komponent
import FeedbackDisplay from "./feedback.jsx";
import "./reportPageStyle.css";
import { saveAs } from 'file-saver';

import {
  useReportLogic,
  exampleEvaluation,
  exampleChatLog,
} from "./reportLogic";
const ReportPage = (props) => {
  const InfoObject = useContext(Context);
  const [messageLog] = InfoObject.chatlog;
  const [, setSimState] = InfoObject.simState;
  const [chosenScenario] = InfoObject.scenario;
  const { callOllamaFeedback, getFeedback } = useReportLogic(props);
  //feedback
  const [showFeedback, setshowFeedback] = useState(false);
  const [feedbackGenerated, setFeedbackGenerated] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);
  return (
    <div className="report-box">
      <h1>Transkribert Samtale</h1>
      {/* 
      <button
        onClick={async () => {
          const summarization = await getFeedback({ log: messageLog });
          console.log("sum:");
          console.log(summarization);
        }}
      >
        Oppsummering
      </button>
      */}
      {/* Viser transkripsjonen med React-komponenten */}
      <Transcription response={messageLog} />
      <section>
        <h2>Tilbakemelding</h2>
        <p>Her kan du få en AI-generert tilbakemelding på samtalen</p>
        {feedbackGenerated ? (
          <button onClick={() => setshowFeedback(!showFeedback)}>
            {showFeedback ? "Skjul tilbakemelding" : "Vis tilbakemelding"}
          </button>
        ) : (
          <button
            onClick={async () => {
              setIsGeneratingFeedback(true);
              const response = await getFeedback({ log: messageLog });

              setFeedback(response);
              setIsGeneratingFeedback(false);
              setFeedbackGenerated(true);
            }}
          >
            {isGeneratingFeedback
              ? "genererer tilbakemelding..."
              : "Generer tilbakemelding"}
          </button>
        )}
        {showFeedback && (
          <FeedbackDisplay response={feedback} scenario={chosenScenario} />
        )}
      </section>

      <br />
      <button
        id="downloadPDF"
        disabled={isGeneratingFeedback}
        onClick={async () => {
          if (!feedbackGenerated) {
            setIsGeneratingFeedback(true);
            const response = await getFeedback({ log: messageLog });
            setFeedback(response);
            setFeedbackGenerated(true);
            setIsGeneratingFeedback(false);
          }

          // Generate the PDF
          const blob = await pdf(
            <ReportPDF feedback={feedback || ""} chatLog={messageLog} />
          ).toBlob();

          saveAs(
            blob,
            `Rapport_samtale_med_${
              chosenScenario?.name
            }_${new Date().toLocaleDateString()}.pdf`
          );
        }}
      >
        {isGeneratingFeedback ? "Genererer tilbakemelding..." : "Last ned PDF"}
      </button>

      {/*
      <PDFDownloadLink
        fileName={`Rapport_samtale_med_${
          chosenScenario?.name
        }_${new Date().toLocaleDateString()}.pdf`}
        document={<ReportPDF feedback={feedback ? feedback : ""} chatLog={messageLog} />}
      >
        {({ loading }) => (
          <button id="downloadPDF">
            {loading ? "Genererer dokument..." : "Last ned PDF"}
          </button>
        )}
      </PDFDownloadLink>
      */}
      <br />
      <br />
      <button onClick={() => setSimState("")}>Tilbake Hjem</button>
    </div>
  );
};

export default ReportPage;
