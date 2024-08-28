import { MidiRequestPayload, MidiResponse } from "../lib/dto";

export const baseLoopPrompt = (midiRequest: MidiRequestPayload): string => {
    const prompt = `
      Given the following musical context, generate a new harmonic and rhythmic MIDI accompaniment.

      # MUSICAL CONTEXT
      1. BPM: ${midiRequest.bpm}
      2. KEY: ${midiRequest.key}
      3. INPUT TIMBRE: ${midiRequest.inputTimbre}
      4. OUTPUT TIMBRE: ${midiRequest.outputTimbre}
      5. GENRE: ${midiRequest.genre}
      6. TIME SIGNATURE: 4/4
      7. SEGMENT LENGTH: 2 bars
      
      # USER MIDI TO GENERATE FITTING ACCOMPANIMENT FOR
      8. INPUT MIDI:
      ${JSON.stringify(midiRequest.inputMidi, null, 2)}

      # REQUIREMENTS:
      1. Create new MIDI notes that complement the input and add musical interest.
      2. Output the new MIDI in a structured JSON format with the following fields:
       - "note": The note pitch (e.g., "C4").
       - "velocity": The note velocity.
       - "start": The start time of the note.
       - "length": The duration of the note.
      3. Make sure that the total of the MIDI events is as long as the input segment length;
       so in the case of TIME SIGNATURE: 4/4 with SEGMENT LENGTH: 2 bars, the 'start' values of the MIDI notes will be under 8
      3. Do not replicate the input MIDI directly — introduce new harmonies and / or chord progressions.
    `
    return prompt
}