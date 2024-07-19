const VALID_BLACK_KEYS: string[] = ['s', 'd', 'g', 'h', 'j'];
const VALID_WHITE_KEYS: string[] = ['z', 'x', 'c', 'v', 'b', 'n', 'm'];
const VALID_KEYS: string[] = [...VALID_BLACK_KEYS, ...VALID_WHITE_KEYS];
// global/constants.ts
const KEY_TO_NOTE: Record<string, string> = {
  z: 'C4',
  s: 'C#4',
  x: 'D4',
  d: 'D#4',
  c: 'E4',
  v: 'F4',
  g: 'F#4',
  b: 'G4',
  h: 'G#4',
  n: 'A4',
  j: 'A#4',
  m: 'B4',
};

const NOTE_TO_KEY: Record<string, string> = {
  C4: 'z',
  'C#4': 's',
  D4: 'x',
  'D#4': 'd',
  E4: 'c',
  F4: 'v',
  'F#4': 'g',
  G4: 'b',
  'G#4': 'h',
  A4: 'n',
  'A#4': 'j',
  B4: 'm',
};

const NOTES = [
  'C4', 'C#4', 'D4', 'D#4',
  'E4', 'F4', 'F#4', 'G4',
  'G#4', 'A4', 'A#4', 'B4'
];

export {
  NOTES,
  VALID_KEYS,
  NOTE_TO_KEY,
  KEY_TO_NOTE,
};
