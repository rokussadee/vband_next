// components/Piano/Piano.tsx
import _ from 'lodash';
import React, { useState, useEffect, useCallback } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { instrumentState } from '../../lib/state';
import Key from '../Key';
import { NOTES, VALID_KEYS, KEY_TO_NOTE } from '../../global/constants';
import { initMIDI } from '../../services/MidiService';
import { playNote as playSynthNote } from '../../services/ToneService';
import { midiNotesState, isRecordingState } from '../../lib/state';

const Piano: React.FC = () => {
  const [pressedKeys, setPressedKeys] = useState<string[]>([]);
  const instrument = useRecoilValue(instrumentState);
  const setMidiNotes = useSetRecoilState(midiNotesState);
  const isRecording = useRecoilValue(isRecordingState);
  const [useMidi, setUseMidi] = useState<boolean>(false);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.repeat) return;
    const key = event.key;
    setPressedKeys((prevPressedKeys) => {
      if (!prevPressedKeys.includes(key) && VALID_KEYS.includes(key)) {
        console.log(`key: ${key}\nKTN[key]: ${KEY_TO_NOTE[key]}`);
        playSynthNote(KEY_TO_NOTE[key]);
        return [...prevPressedKeys, key];
      }
      return prevPressedKeys;
    });
  }, []);

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
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
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  useEffect(() => {
    initMIDI(setMidiNotes, () => isRecording);
  }, [setMidiNotes, isRecording]);

  const toggleMidi = () => {
    setUseMidi((prev) => !prev);
  };

  const keys = _.map(NOTES, (note, index) => (
    <Key key={index} note={note} pressedKeys={pressedKeys} />
  ));

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
