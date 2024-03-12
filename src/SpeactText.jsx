import React, { useEffect, useState, useRef } from "react";

const SpeechRecognitionFallback = ({ children }) => {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognition = useRef(null);

  useEffect(() => {
    if ("webkitSpeechRecognition" in window) {
      recognition.current = new window.webkitSpeechRecognition();
      recognition.current.continuous = true;
      recognition.current.interimResults = true;

      recognition.current.onstart = () => {
        setListening(true);
      };

      recognition.current.onresult = (event) => {
        let interimTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          interimTranscript += event.results[i][0].transcript;
        }

        setTranscript(interimTranscript);
      };

      recognition.current.onend = () => {
        setListening(false);
      };

      if (listening) {
        recognition.current.start();
      }
    }
  }, [listening]);

  return (
    <>
      {children({
        listening,
        transcript,
        startListening: () => {
          if ("webkitSpeechRecognition" in window) {
            recognition.current.start();
          }
        },
        stopListening: () => {
          if ("webkitSpeechRecognition" in window) {
            recognition.current.stop();
          }
        },
      })}
    </>
  );
};

export default SpeechRecognitionFallback;
