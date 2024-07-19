// state.ts
import { atom } from 'recoil';

export const isRecordingState = atom<boolean>({
  key: 'isRecordingState',
  default: false,
});

export const midiNotesState = atom<Array<{ note: number; velocity: number }>>({
  key: 'midiNotesState',
  default: [],
});

export const bpmState = atom<number>({
  key: 'bpmState',
  default: 120, // Default BPM value
});

export const measuresState = atom<number>({
  key: 'measuresState',
  default: 4, // Default number of measures
});

export const instrumentState = atom<string>({
  key: 'instrumentState',
  default: 'piano', // default instrument
});
