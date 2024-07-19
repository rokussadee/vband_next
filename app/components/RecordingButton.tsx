// components/RecordingButton.tsx
"use client";

import React, {useState, useEffect} from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { isRecordingState, bpmState, measuresState, midiNotesState} from '../lib/state';
import { initMIDI } from '../services/MidiService';

const RecordingButton: React.FC = () => {
  const [isRecording, setIsRecording] = useRecoilState(isRecordingState);
  const bpm = useRecoilValue(bpmState);
  const measures = useRecoilValue(measuresState);
  const [click, setClick] = useState<HTMLAudioElement | null>(null);
  const setMidiNotes = useRecoilState(midiNotesState)[1];
  
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
    playClick(4); // Play four preparatory clicks

    setTimeout(() => {
      setIsRecording(true);
      setTimeout(() => setIsRecording(false), (60 / bpm) * measures * 4 * 1000); // Stop recording after the set number of measures
    }, (60 / bpm) * 4 * 1000); // Start recording after four preparatory clicks
  };

  const stopRecording = () => {
    setIsRecording(false);
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div>
      <button className="p-4 border-2 border-red-300 cursor-pointer hover:bg-white" onClick={toggleRecording}>
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>
      <p>Recording state: {isRecording ? 'Recording' : 'Not Recording'}</p>
    </div>
  );
};

export default RecordingButton;
