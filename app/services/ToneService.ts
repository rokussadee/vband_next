// services/ToneService.ts
import { SetterOrUpdater } from 'recoil';
import * as Tone from 'tone';
import { MidiNote } from '../lib/state';

Tone.getContext().lookAhead = 0;

export const playNote = (note: string) => {
  const synth = new Tone.Synth().toDestination();

  console.log(note)
  const now = Tone.now();
  synth.triggerAttackRelease(note, '8n', now + 0.1);
};

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
