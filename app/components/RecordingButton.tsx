// components/RecordingButton.tsx
"use client";

import React, {useState, useEffect} from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { isRecordingState, bpmState, measuresState, midiNotesState} from '../lib/state';
import * as Tone from 'tone';

const RecordingButton: React.FC = () => {
  const [isRecording, setIsRecording] = useRecoilState(isRecordingState);
  const bpm = useRecoilValue(bpmState);
  const measures = useRecoilValue(measuresState);
  const [click, setClick] = useState<HTMLAudioElement | null>(null);
  const setMidiNotes = useRecoilState(midiNotesState)[1];
  const transport = Tone.getTransport();
  
  useEffect(() => {
    const clickSound = new Audio('/rottus_rim_v2.wav'); // Ensure you have this file in your public directory
    setClick(() => clickSound);
  }, []);
   
  const playClick = (count: number) => {
    if (click) {
      click.currentTime = 0;
      click.play();
    }
    if (count > 1) {
      setTimeout(() => playClick(count - 1), (60 / bpm) * 1000);
    }
  };

  const startRecording = () => {
    setMidiNotes([]); // Clear previous notes
    transport.stop(); // Stop the transport
    transport.position = "0:0:0"; // Reset the transport position to "0:0:0"
    
    playClick(4); // Play four preparatory clicks

    setTimeout(() => {
      setIsRecording(true);
      transport.start()
      setTimeout(() => {
         setIsRecording(false);
         transport.stop();  
      }, (60 / bpm) * measures * 4 * 1000); // Stop recording after the set number of measures
    }, (60 / bpm) * 4 * 1000); // Start recording after four preparatory clicks
  };

  const stopRecording = () => {
    setIsRecording(false);
    transport.stop();
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div className='flex items-center'>
    <p className='mr-6'>Recording state: <span className='font-semibold'>{isRecording ? 'Recording' : 'Not Recording'}</span></p>
    <button className="pl-6 flex items-center pr-6 font-bold pt-2 pb-2 rounded-full text-neutral-50  bg-red-600 cursor-pointer hover:drop-shadow-lg" onClick={toggleRecording}>
      {isRecording ? 'Stop Recording' : 'Start Recording'}
      {isRecording ? <div className='p-2 bg-neutral-50 ml-2'></div> : <div className='p-2 ml-2 rounded-full bg-neutral-50'></div> }
    </button>
  </div>
  );
};

export default RecordingButton;
