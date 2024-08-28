import { Note, Scale, Key, Chord } from 'tonal';
import { MidiLoop } from '../lib/types';
import * as Tone from 'tone';
import OpanAI from 'openai';
import { useRecoilState, useRecoilValue } from 'recoil';
import { bpmState, currentKeyState, genreState, inputTimbreState, outputTimbreState, selectedMidiLoopState } from '../lib/state';
import { MidiRequestPayload } from '../lib/dto';
import { generateBaseLoop } from './MidiGenService';

// Detect the musical key from a set of notes
export const detectKey = (notes: string[]): string | null => {
  const keys = Scale.detect(notes);
  return keys.length ? keys[0] : null;
};

// Detect the scale from a set of notes
export const detectScales = (notes: string[]): string[] | null => {
  const scales = Scale.detect(notes);
  return scales.length ? scales : null;
};

// Detect the chord from a set of notes
export const getChordForNotes = (notes: string[]): string | null => {
  const chord = Chord.detect(notes);
  return chord.length ? chord[0] : null;
};

// Get the note name from a MIDI note number
export const getNoteName = (midiNote: number): string => {
  return Note.fromMidi(midiNote);
};

// Transpose a note by a given interval
export const transposeNote = (note: string, interval: string): string => {
  return Note.transpose(note, interval);
};

// Get all the notes of a scale by its name
export const getScaleNotes = (scaleName: string): string[] => {
  return Scale.get(scaleName).notes;
};

// Get all the notes of a chord by its name
export const getChordNotes = (chordName: string): string[] => {
  return Chord.get(chordName).notes;
};

