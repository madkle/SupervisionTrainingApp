import React, { useState, useContext } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { exampleChatLog } from "./reportLogic"; // Feedback er fjernet
import ReportPDF from "./pdf.js";
import { Context } from "../../App.jsx";
import Transcription from "./transcription.jsx"; // Importer din nye komponent
import "./reportPageStyle.css";

const ReportPage = (props) => {
  const InfoObject = useContext(Context);
  const [messageLog] = InfoObject.chatlog;
  const [, setSimState] = InfoObject.simState;
  const [chosenScenario] = InfoObject.scenario;

  return (
    <div className="report-box">
      <h1>Transkribert Samtale</h1>

      {/* Viser transkripsjonen med React-komponenten */}
      <Transcription response={messageLog} />

      <br />
      <PDFDownloadLink
        fileName={`Transkript_samtale_med_${
          chosenScenario?.name
        }_${new Date().toLocaleDateString()}.pdf`}
        document={<ReportPDF chatLog={messageLog} />}
      >
        {({ loading }) => (
          <button id="downloadPDF">
            {loading ? "Genererer dokument..." : "Last ned PDF"}
          </button>
        )}
      </PDFDownloadLink>

      <br />
      <br />
      <button onClick={() => setSimState("")}>Tilbake Hjem</button>
    </div>
  );
};

export default ReportPage;
