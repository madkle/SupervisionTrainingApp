import React from "react";
import Tts from "./testingComps/tts.js";
import Transcription from "./testingComps/Transcription.js";
import AudioRecorder from "./testingComps/recording.js";
import Llm from "./testingComps/ollama.js";
import StreamTest from "./testingComps/streamtest.js";

const TestingSuite = () => {

  return (
    <div>
      <StreamTest />
      <Llm />
      <Tts />
      <Transcription />
      <AudioRecorder />
    </div>
  );
};
export default TestingSuite;
