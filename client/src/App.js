import logo from './logo.svg';
import './App.css';
import Tts from "./comp/tts.js";
import Transcription from "./comp/Transcription.js";
import AudioRecorder from "./comp/recording.js";
function App() {
  return (
    <div className="App">
      <Tts/>
      <Transcription/>
      <AudioRecorder/>
    </div>
  );
}

export default App;
