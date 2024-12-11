import logo from './logo.svg';
import './App.css';
import Tts from "./comp/tts.js";
import Transcription from "./comp/Transcription.js";

function App() {
  return (
    <div className="App">
      <Tts/>
      <Transcription/>
    </div>
  );
}

export default App;
