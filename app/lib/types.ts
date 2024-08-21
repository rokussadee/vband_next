import { Tone } from "tone/build/esm/core/Tone"
import { BarsBeatsSixteenths } from "tone/build/esm/core/type/Units"

export interface MidiNote {
  note: number,
  velocity: number,
  start: BarsBeatsSixteenths,
  length: BarsBeatsSixteenths 
}

export interface MidiLoop {
  id: string,
  start: BarsBeatsSixteenths,
  end: BarsBeatsSixteenths,
  notes: MidiNote[]
}

export interface Cursor {
  position: number
}

