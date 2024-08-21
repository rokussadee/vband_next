// services/ToneService.ts
import { SetterOrUpdater } from 'recoil';
import * as Tone from 'tone';
import { PolySynthOptions } from 'tone';
import { MidiNote, MidiLoop, Cursor } from '../lib/types';
import { current } from '@reduxjs/toolkit';

Tone.getContext().lookAhead = 0;

// Singleton PolySynth instance
let polySynth: Tone.PolySynth | null = null;

export const initializePolySynth = (polyphony: number = 6) => {
  if (!polySynth) {
    polySynth = new Tone.PolySynth(
      {
        maxPolyphony: polyphony, 
        voice: Tone.Synth
      }).toDestination();
  }
};

export const playNote = (note: string) => {
  if (!polySynth) {
    console.error('PolySynth not initialized. Call initializePolySynth first.');
    return;
  }
  console.log(`play note: ${note}`);
  const now = Tone.now();
  polySynth.triggerAttack(note, now, 40);
};

export const stopNote = (note: string) => {
  if (!polySynth) {
    console.error('PolySynth not initialized. Call initializePolySynth first.');
    return;
  }
  console.log(`stop note: ${note}`)
  // Trigger the release portion of the note, stopping it
  polySynth.triggerRelease(note, Tone.now() + .1);
}

export const recordMidiNote = (
  note: MidiNote,
  setMidiNotes: SetterOrUpdater<MidiNote[]>,
  setLoops: SetterOrUpdater<MidiLoop[]>,
  currentLoopId: string,
) => {
  setMidiNotes((prevNotes) => [...prevNotes, note]);
  
  setLoops((prevLoops) => {
    const loopIndex = prevLoops.findIndex(loop => loop.id === currentLoopId);
    if (loopIndex !== -1) {
      const updatedLoops = [...prevLoops];
      updatedLoops[loopIndex] = {
        ...updatedLoops[loopIndex],
        notes: [...updatedLoops[loopIndex].notes, note],
      }
      return updatedLoops;
    }
    else {
      return prevLoops;
    }
  });
};

let currentLoop: Tone.Loop | null = null;

export const startLoop = (
  loop: MidiLoop,
  bpm: number,
  setCursorPosition: SetterOrUpdater<Cursor>
) => {
  if (currentLoop) {
    currentLoop.stop();
    currentLoop.dispose();
  }
  
  const transport = Tone.getTransport();
  transport.bpm.value = bpm;
  transport.loop = true;
  transport.loopStart = loop.start;
  transport.loopEnd = loop.end;
  
  currentLoop =  new Tone.Loop((time) => {
    loop.notes.forEach(note => {
      const synth = new Tone.Synth().toDestination();
      synth.triggerAttackRelease(
        Tone.Frequency(note.note, "midi").toNote(), 
        note.length, 
        time + note.start);
    });

    const draw = Tone.getDraw();
    const transport = Tone.getTransport();
    transport.scheduleRepeat(() => {
    }, "16n");
    draw.schedule(() => {
      const transportTime = Tone.TransportTime();
      const newCursor: Cursor = {position: transportTime.toSeconds() * (bpm/60)};
      setCursorPosition(newCursor);
    }, time)
  }, `${loop.end - loop.start}m`);
  
  currentLoop.start(0);
  transport.start();
};

export const stopLoop = () => {
  if (currentLoop) {
    currentLoop.stop();
    currentLoop.dispose();
    currentLoop = null;
  };

  const transport = Tone.getTransport();
  transport.stop();
}

export const initMIDI = (
  setMidiNotes: SetterOrUpdater<Array<MidiNote>>,
  getIsRecording: () => boolean
) => {
  if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess().then(AccessMIDI => {
      const inputs = AccessMIDI.inputs.values();
      console.log("inputs: ", inputs);
      for (let input in inputs) {
        console.log("input value: ", input);
        console.log("input contents: ", input.toString);

      }
    })
    .catch((err) => console.error("MIDI could not be enabled: ", err))
  }
  else {
    console.warn("No MIDI support in your browser.")
  }
}
