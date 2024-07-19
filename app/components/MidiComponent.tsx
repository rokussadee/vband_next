// components/MidiComponent.tsx
"use client";

import React, { useEffect } from 'react';
import { useSetRecoilState, useRecoilValue } from 'recoil';
import { midiNotesState, isRecordingState } from '../lib/state';
import { initMIDI } from '../services/MidiService';

const MidiComponent: React.FC = () => {
  const setMidiNotes = useSetRecoilState(midiNotesState);
  const isRecording = useRecoilValue(isRecordingState);

  useEffect(() => {
    initMIDI(setMidiNotes, () => isRecording);
  }, [setMidiNotes, isRecording]);

  return <div>Listening for MIDI input...</div>;
};

export default MidiComponent;
