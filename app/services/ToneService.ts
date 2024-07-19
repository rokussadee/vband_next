// services/ToneService.ts
import * as Tone from 'tone';


export const playNote = (note: string) => {
  const synth = new Tone.Synth().toDestination();
  console.log(note)
  const now = Tone.now();
  synth.triggerAttackRelease(note, '8n', now + 0.1);
};
