import React, { useState,useEffect, useRef } from "react";
import _ from "lodash";
import io from 'socket.io-client';

const socket = io('http://localhost:4000');

const SpeechToText = ({ listening, transcript, startListening, stopListening }) => {
  const [transcriptions, setTranscriptions] = useState([]);
  const [transcriptionIndex, setTranscriptionIndex] = useState(0);
  const debouncedSetTranscriptions = useRef(null);

    const [roomId, setRoomId] = useState('');
  

  // creating room
    const createRoom = () => {
      const roomId = prompt('Enter room ID:');
      if (roomId.trim() !== '') {
        socket.emit('joinRoom', roomId);
        setRoomId(roomId);
      }
    };

    //join room 
      const joinRoom = () => {
        const roomId = prompt('Enter room ID:');
        if (roomId.trim() !== '') {
          socket.emit('joinRoom', roomId);
          setRoomId(roomId);
        }
      };

  useEffect(() => {
    if (transcript) {
      if (!debouncedSetTranscriptions.current) {
        debouncedSetTranscriptions.current = _.debounce((transcript) => {
          setTranscriptions((prevTranscriptions) => [
            ...prevTranscriptions,
            { transcript, timestamp: new Date().toISOString() },
          ]);

          setTranscriptionIndex((prevTranscriptionIndex) => prevTranscriptionIndex + 1);
          debouncedSetTranscriptions.current.cancel();
          debouncedSetTranscriptions.current = null;
        }, 1000);
      }

      debouncedSetTranscriptions.current(transcript);
    }
  }, [transcript]);

  return (
    <div>
      <div>
        <button onClick={createRoom}>Create Room</button>
        <button onClick={joinRoom}>Join Room</button>
      </div>
      <button onClick={listening ? stopListening : startListening}>
        {listening ? "Stop" : "Start"} Listening
      </button>
      <div>
 
        {transcriptions.map((transcription, index) => (
          <div key={index}>
            <p>{transcription.transcript}</p>
            <p>{transcription.timestamp}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpeechToText;


 