// components/Piano/Piano.tsx
import _ from 'lodash';
import React, { useState, useEffect, useCallback } from 'react';
import { useRecoilValue, useSetRecoilState, useRecoilState } from 'recoil';
import { instrumentState } from '../../lib/state';
import Key from '../Key';
import { NOTES, VALID_KEYS, KEY_TO_NOTE } from '../../global/constants';
import { playNote as playSynthNote, initMIDI } from '../../services/ToneService';
import { midiNotesState, isRecordingState, MidiNote } from '../../lib/state';
import { useEventListener } from 'usehooks-ts';
import * as Tone from 'tone';

const Piano: React.FC = () => {
  const [pressedKeys, setPressedKeys] = useState<string[]>([]);
  const instrument = useRecoilValue(instrumentState);
  const [midiNotes, setMidiNotes] = useRecoilState<MidiNote[]>(midiNotesState);
  const isRecording = useRecoilValue(isRecordingState);
  const [useMidi, setUseMidi] = useState<boolean>(false);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.repeat) return;
    const key = event.key;
    setPressedKeys((prevPressedKeys) => {
      if (!prevPressedKeys.includes(key) && VALID_KEYS.includes(key)) {
        const note = KEY_TO_NOTE[key];
        console.log(`key: ${note}`);
        playSynthNote(note);
        
        if (isRecording) {
          const time = Tone.now();
          const newNote: MidiNote = {note: Tone.Frequency(note).toMidi(), velocity: 127, time: time};
          console.log(`Recording note: ${newNote}`);
          setMidiNotes((prevNotes) => [...prevNotes, newNote]);
        }
        return [...prevPressedKeys, key];
      }
      return prevPressedKeys;
    });
  }, [playSynthNote, isRecording, setMidiNotes]);

  const handleKeyUp = useCallback((event: KeyboardEvent
  ) => {
    const key = event.key;
    setPressedKeys((prevPressedKeys) => {
      const index = prevPressedKeys.indexOf(key);
      if (index > -1) {
        const updatedPressedKeys = [...prevPressedKeys];
        updatedPressedKeys.splice(index, 1);
        return updatedPressedKeys;
      }
      return prevPressedKeys;
    });
  }, []);

  useEffect(() => {
    initMIDI(setMidiNotes, () => isRecording);
  }, [setMidiNotes, isRecording]);

  const toggleMidi = () => {
    setUseMidi((prev) => !prev);
  };

  const keys = _.map(NOTES, (note, index) => (
    <Key key={index} note={note} pressedKeys={pressedKeys} />
  ));
  
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
