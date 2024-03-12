import React from "react";
import SpeechRecognitionFallback from "./SpeactText";
import SpeechToText from "./Voice";

function App() {
  return (
    <SpeechRecognitionFallback>
      {({ listening, transcript, startListening, stopListening }) => (
        <SpeechToText listening={listening} transcript={transcript} startListening={startListening} stopListening={stopListening} />
      )}
    </SpeechRecognitionFallback>
  );
}

export default App;