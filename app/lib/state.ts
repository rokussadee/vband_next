// state.ts
import { atom } from 'recoil';
import { MidiNote, Cursor, MidiLoop } from '../lib/types';
import { Loop } from 'tone';
import { BarsBeatsSixteenths } from 'tone/build/esm/core/type/Units';
import { Message } from './dto';
import OpanAI from 'openai';

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

export const genreState = atom<"pop" | "metal" | "rock" | "blues" | "jazz">({
  key: 'genreState',
  default: "pop"
});

 export const inputTimbreState = atom<"acoustic guitar" | "piano" | "flute" | "violin" | "electric guitar">({
  key: 'inputTimbreState',
  default: "piano"
 });
 
 export const outputTimbreState = atom<"acoustic guitar" | "piano" | "flute" | "violin" | "electric guitar">({
  key: 'outputTimbreState',
  default: "piano"
 })

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

export const apiGeneratedLoopsState = atom<Array<MidiLoop>>({
  key: 'apiGeneratedLoopsState',
  default: [],
});

// Current Key Recoil State
export const currentKeyState = atom<string | null>({
  key: 'currentKeyState',
  default: null,
});

export const threadState = atom<string | null>({
  key: 'threadState ',
  default: null
})

export const runState = atom<string | null>({
  key: "runState ",
  default: null
})

export const threadMessagesState = atom<OpanAI.Beta.Threads.Messages.Message[] | null>({
  key: "threadMessagesState",
  default: null
})

export const selectedMidiLoopState = atom<MidiLoop | null>({
  key: "selectedMidiLoopState",
  default: null
})

export const openaiClientState = atom<OpanAI | null>({
  key: "openaiClientState",
  default: null
})

export const latestRunIDState = atom<string | null>({
  key: "latestRunIDState",
  default: null
})