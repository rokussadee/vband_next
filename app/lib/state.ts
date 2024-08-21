// state.ts
import { atom } from 'recoil';
import { MidiNote, Cursor, MidiLoop } from '../lib/types';
import { Loop } from 'tone';
import { BarsBeatsSixteenths } from 'tone/build/esm/core/type/Units';

export const isPlayingState = atom<boolean>({
  key: 'isPlayingState',
  default: false,
});

export const isRecordingState = atom<boolean>({
  key: 'isRecordingState',
  default: false,
});

export const midiNotesState = atom<Array<MidiNote>>({
  key: 'midiNotesState',
  default: [],
});

export const activeNotesState = atom<Array<{note: number, start: BarsBeatsSixteenths}>>({
  key: 'activeNotesState',
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

export const loopsState = atom<Array<MidiLoop>>({
  key: 'loopState',
  default: [],
});

export const cursorState = atom<Cursor>({
  key: 'cursorState',
  default: { position: 0 },
});