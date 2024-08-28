import { MidiNote } from "../lib/types";

/**
 * Parses the assistant's response to extract MIDI data from the JSON embedded in the text field.
 * @param assistantMessage The assistant's response message.
 * @returns An array of parsed MIDI notes.
 */
export const parseAssistantResponse = (assistantMessage: any): MidiNote[] => {
  try {
    // Extract the raw JSON string from the text value
    const rawJson = assistantMessage.content[0].text.value;

    // Parse the raw JSON string into an object
    const parsedData = JSON.parse(rawJson);

    // Identify the property that contains the MIDI data (assuming it's an array)
    const midiProperty = Object.keys(parsedData).find(key => Array.isArray(parsedData[key]));

    if (!midiProperty) {
      throw new Error("No MIDI data found in the assistant's response.");
    }

    // Extract the MIDI data
    const midiData = parsedData[midiProperty] as MidiNote[];

    // Map and return the MIDI data, ensuring all required fields are present
    return midiData.map((note: MidiNote) => ({
      note: note.note,
      velocity: note.velocity,
      start: note.start,
      length: note.length
    }));
  } catch (error) {
    console.error("Error parsing assistant response:", error);
    return [];
  }
};