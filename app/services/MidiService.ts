// services/midiService.ts
import { WebMidi, NoteMessageEvent } from 'webmidi';
import { SetterOrUpdater } from 'recoil';
import { midiNotesState } from '../lib/state';

export const initMIDI = (
  setMidiNotes: SetterOrUpdater<Array<{ note: number; velocity: number }>>,
  getIsRecording: () => boolean
) => {
  WebMidi.enable()
  .then(() => {
    const input = WebMidi.inputs[0];
    if (input) {
      console.log('MIDI input connected:', input.name);
      input.addListener('noteon', (e: NoteMessageEvent) => {
        if(getIsRecording()) {
          console.log('Note on: ', e.note.name, e.note.number, e.note.attack)
          setMidiNotes((prevNotes) => [...prevNotes, { note: e.note.number, velocity: e.note.attack}]);
        }
      });
    } else {
      console.warn("No MIDI input detected.")
    }
  })
  .catch((err) => {
    console.error('WebMidi could not be enabled.', err)
  });
};
