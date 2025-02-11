import React from "react";
import Tts from "./testingComps/tts.jsx";
import Transcription from "./testingComps/Transcription.jsx";
import AudioRecorder from "./testingComps/recording.jsx";
import Llm from "./testingComps/ollama.jsx";
import StreamTest from "./testingComps/streamtest.jsx";
import OllamaChat from "./testingComps/ollamaChat.jsx";
import ReportPage from "../reportPage/reportPage.jsx";
const TestingSuite = () => {

  return (
    <div>
      <OllamaChat/>
      <Llm />
      <Tts />
      <Transcription />
      <AudioRecorder />
      <br/>
      <ReportPage testing={true} hasSavedChat={false}/>
    </div>
  );
};
export default TestingSuite;
