
// components/Piano/Piano.tsx
import _ from 'lodash';
import React, { useState, useEffect, useCallback } from 'react';
import { useRecoilValue, useRecoilState } from 'recoil';
import { instrumentState } from '../../lib/state';
import Key from '../Key';
import { NOTES, VALID_KEYS, KEY_TO_NOTE } from '../../global/constants';
import { playNote as playSynthNote, stopNote as stopSynthNote, initMIDI, initializePolySynth } from '../../services/ToneService';
import { midiNotesState, isRecordingState, activeNotesState } from '../../lib/state';
import { MidiNote } from '../../lib/types';
import { useEventListener } from 'usehooks-ts';
import * as Tone from 'tone';
import { BarsBeatsSixteenths } from 'tone/build/esm/core/type/Units';

const Piano: React.FC = () => {
  const [pressedKeys, setPressedKeys] = useState<string[]>([]);
  const instrument = useRecoilValue(instrumentState);
  const [midiNotes, setMidiNotes] = useRecoilState<Array<MidiNote>>(midiNotesState);
  const [activeNotes, setActiveNotes] = useRecoilState<Array<{note: number, start: BarsBeatsSixteenths}>>(activeNotesState);
  const isRecording = useRecoilValue(isRecordingState);
  const [useMidi, setUseMidi] = useState<boolean>(false);

  // Initialize PolySynth when the component mounts
  useEffect(() => {
    initializePolySynth();  // Call this to ensure PolySynth is ready
  }, []);
  
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.repeat) return;
    const key = event.key;
    const note: string = KEY_TO_NOTE[key];
    const noteNumber = Tone.Frequency(note).toMidi();
    const time = Tone.Time(Tone.now()).toBarsBeatsSixteenths();
        
    setPressedKeys((prevPressedKeys) => {
      if (!prevPressedKeys.includes(key) && VALID_KEYS.includes(key)) {
        setActiveNotes((prevActiveNotes) => {
          const isAlreadyActive = prevActiveNotes.some(n => n.note === noteNumber);
          console.log(`isAlreadyActive: ${isAlreadyActive}`);
          
          if (!isAlreadyActive) {
            playSynthNote(note);
            const newActiveNotes = [...prevActiveNotes, { note: noteNumber, start: time }];
            console.log(`activeNotes after adding: ${JSON.stringify(newActiveNotes)}`);
            return newActiveNotes;
          }

          return prevActiveNotes;
        });

        return [...prevPressedKeys, key];
      }
      return prevPressedKeys;
    });
  }, [setPressedKeys, setActiveNotes, playSynthNote]);

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    const key = event.key;
    const note = KEY_TO_NOTE[key];
    const noteNumber = Tone.Frequency(note).toMidi();

    let activeNoteToStop: MidiNote | null = null;

    setActiveNotes((prevActiveNotes) => {
      const activeNote = prevActiveNotes.find(n => n.note === noteNumber);
      console.log(`activeNote on keyUp: ${activeNote?.note}`);
      console.log(`activeNotes before stopping: ${JSON.stringify(prevActiveNotes)}`);

      if (activeNote) {
        activeNoteToStop = {
          note: activeNote.note,
          velocity: 120,
          start: activeNote.start,
          length: Tone.Time(Tone.now() - Tone.Time(activeNote.start).toSeconds()).toBarsBeatsSixteenths(),
        };

        const updatedActiveNotes = prevActiveNotes.filter(n => n.note !== noteNumber);
        console.log(`activeNotes after stopping: ${JSON.stringify(updatedActiveNotes)}`);
        return updatedActiveNotes;
      }

      return prevActiveNotes;
    });
  
    if (activeNoteToStop && isRecording) {
      setMidiNotes(prevNotes => [...prevNotes, activeNoteToStop!]);
    }

    stopSynthNote(note);
    setPressedKeys((prev) => prev.filter(k => k !== key));
  }, [setActiveNotes, setMidiNotes, stopSynthNote, isRecording]);

  useEffect(() => {
    initMIDI(setMidiNotes, () => isRecording);
  }, [setMidiNotes, isRecording]);

  const toggleMidi = () => {
    setUseMidi(prev => !prev);
  };

  const keys = _.map(NOTES, (note, index) => (
    <Key key={index} note={note} pressedKeys={pressedKeys} />
  ));

  // Use event listener hooks to manage keyboard input
  useEventListener('keydown', handleKeyDown);
  useEventListener('keyup', handleKeyUp);

  return (
    <div tabIndex={0}>
      <button onClick={toggleMidi}>
        {useMidi ? 'Switch to Keyboard' : 'Switch to MIDI Controller'}
      </button>
      <div className="piano flex">
        {keys}
      </div>
    </div>
  );
};

export default Piano;