import { z } from "zod";
import { MidiLoop, MidiNote } from "./types";

export type MessageRole = "user" | "system" | "assistant";

export interface Message {
    role: MessageRole,
    content: string
}

export const createMessage = (role: MessageRole, content: string) => ({
        role: role,
        content: content
});

export interface MidiRequestPayload {
    inputMidi: MidiNote[];  // MIDI notes in a specific format
    key: string;        // Musical key detected by TonalJS
    bpm: number;
    genre: string;
    inputTimbre: string;
    outputTimbre: string;
}

export interface MidiResponse {
loops: MidiLoop[];
}