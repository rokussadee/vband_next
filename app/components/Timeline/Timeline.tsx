import {useEffect, useState} from "react";
import { cursorState, isPlayingState, loopsState, midiNotesState, isRecordingState, apiGeneratedLoopsState, openaiClientState, threadState, selectedMidiLoopState, bpmState, genreState, inputTimbreState, outputTimbreState, latestRunIDState} from "../../lib/state";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { Cursor, MidiNote, MidiLoop } from '../../lib/types';
import { startLoop, stopLoop } from "../../services/ToneService";
import * as Tone from 'tone';
import OpanAI from 'openai';
import MidiBlock from "../MidiBlock";
import Playhead from "../Playhead";
import { detectKey } from "../..//services/TonalService";
import { MidiRequestPayload } from "@/app/lib/dto";
import { createRun, generateBaseLoop, getMessages, pollRunStatus } from "@/app/services/MidiGenService";
import { getOpenAIClient } from "@/app/lib/openaiClient";
import { parseAssistantResponse } from "@/app/utils/midiParser";

export interface TimelineProps {
	width: number,
	height: number, 
	numMeasures: number,
	numBeatsPerMeasure: number
}

const Timeline: React.FC<TimelineProps> = ({width, height, numMeasures, numBeatsPerMeasure}) => {
	const midiNotes = useRecoilValue<Array<MidiNote>>(midiNotesState);
	const loops = useRecoilValue<Array<MidiLoop>>(loopsState);
    const [apiGeneratedLoops, setApiGeneratedLoops] = useRecoilState<Array<MidiLoop>>(apiGeneratedLoopsState);
	const cursor = useRecoilValue<Cursor>(cursorState);
	const isPlaying = useRecoilValue<boolean>(isPlayingState);
	const isRecording = useRecoilValue<boolean>(isRecordingState)
	const setCursorPosition = useSetRecoilState<Cursor>(cursorState);
	const setLoops = useSetRecoilState(loopsState);
	const threadID = useRecoilValue<string | null>(threadState);
	const [selectedMidiLoop, setSelectedMidiLoop] = useRecoilState<MidiLoop | null>(selectedMidiLoopState);
	const bpm = useRecoilValue<number>(bpmState);
	const genre = useRecoilValue<"pop" | "metal" | "rock" | "blues" | "jazz">(genreState);
	const inputTimbre = useRecoilValue<"acoustic guitar" | "piano" | "flute" | "violin" | "electric guitar">(inputTimbreState);
	const outputTimbre = useRecoilValue<"acoustic guitar" | "piano" | "flute" | "violin" | "electric guitar">(outputTimbreState);
	const [currentRunID, setRunID] = useRecoilState<string | null>(latestRunIDState);
	const [loading, setLoading] = useState(false); // Track loading state
	const [generatedMessage, setGeneratedMessage] = useState<string | null>(null); // Track generated message

	useEffect(() => {
		if (!isRecording && midiNotes.length > 0) {
			const newLoop: MidiLoop = generateLoopFromMidiNotes(midiNotes);
			setLoops((prevLoops) => {
				const updatedLoops = [...prevLoops, newLoop];
				console.log(`new loop added:`);
				console.log(JSON.stringify(newLoop) + "\n");
				console.log(`loops:`);
				console.log(JSON.stringify(updatedLoops) + "\n");
				return updatedLoops;
			});
			setSelectedMidiLoop(newLoop);	
		}
	}, [midiNotes, setLoops, isRecording])
	
	useEffect(() => {
		console.log(`selectedMidiLoop: ${selectedMidiLoop}`)
		console.log(`threadID: ${threadID}`)
		if (selectedMidiLoop && threadID) {
			const notes = selectedMidiLoop.notes.map(note => Tone.Frequency(note.note).toNote());
			const detectedKey = detectKey(notes);
			const payload: MidiRequestPayload = {
      			inputMidi: selectedMidiLoop.notes,
      			key: detectedKey!,
      			bpm: bpm,
      			genre: genre,
      			inputTimbre: inputTimbre,
      			outputTimbre: outputTimbre,
    		}
			
			setLoading(true);
			generateBaseLoop(threadID, payload, (status) => {
				console.log(status);
			  if (status !== "completed") {
				console.log(`Current status: ${status}`);
			  } else {
				setLoading(false);
			  }
			})
			  .then((result) => {
				if (result.success && result.message) {
				  setGeneratedMessage(result.message);
				  console.log('Generated base loop:', result.message);
				  // Further processing of the generated message
				  const parsedNotes = parseAssistantResponse(result.message);
				  const generatedLoop: MidiLoop = {
				    id: `generatedLoop_${Date.now()}`,
					start: selectedMidiLoop.start,
					end: selectedMidiLoop.end,
					notes: parsedNotes
				  }
				  setApiGeneratedLoops(prevLoops => [...prevLoops, generatedLoop]);
				} else {
				  console.error("Generation failed:", result.message);
				}
			  })
			  .catch(err => {
				setLoading(false);
				console.error("Error in generateBaseLoop:", err);
			  });

			}
	}, [selectedMidiLoop, threadID, bpm, genre, inputTimbre, outputTimbre])

	useEffect(() => {
	  console.log("Updated apiGeneratedLoops:", apiGeneratedLoops);
	}, [apiGeneratedLoops]);

	const generateLoopFromMidiNotes = (notes: Array<MidiNote>): MidiLoop => {
		const firstNoteStart = Tone.Time(notes[0].start).toBarsBeatsSixteenths(); // Get the start time of the first note
		const offset = Tone.Time(firstNoteStart).toSeconds(); // Calculate the offset in seconds

  		const adjustedNotes = notes.map(note => ({
    		...note,
    		start: Tone.Time(Tone.Time(note.start).toSeconds() - offset).toBarsBeatsSixteenths()
  		}));
		const loop: MidiLoop = {
			id: `loop${loops.length}`, 
			start: `${loops.length * 4}:0:0`, 
			end: `${(loops.length + 1) * 4}:0:0`, 
			notes: adjustedNotes};
		
		return loop;
	}
	const handlePlay = () => {
		if (loops.length > 0) {
			startLoop(loops[0], 120, (pos) => setCursorPosition( pos));
		}
	}
	
	const handleStop = () => {
		stopLoop();  	  
	}
	
	  // Generate note labels for the left side of the grid
	const noteLabels = [];
	for (let i = 71; i >= 0; i--) {
		const note = Tone.Frequency(i, "midi").toNote();
		noteLabels.push(note);
	}
	
	return (
		<div className="w-80 h-80 overflow-y-auto flex">
			{/* Note labels */}
			<div className="w-12 flex flex-col">
        	{noteLabels.map((label, index) => (
        	  <div key={index} className="h-4 flex items-center justify-center">
        	    {label}
        	  </div>
        	))}
      		</div>

      		{/* Timeline grid */}
	    	<div className="flex-1 relative w-full h-full grid grid-cols-64 grid-rows-24 gap-1">
        		{/* Grid lines */}
				{Array.from({ length: 16 * 71 }).map((_, i) => (
        		  <div
        		    key={i}
        		    className={`border ${i % 16 === 0 ? 'border-black' : 'border-gray-300'} 
        		                ${i % 71 === 0 ? 'border-b border-black' : 'border-b border-gray-300'}`}
        		  ></div>
        		))}        

				{/* Recorded MIDI Track */}
                <div className="track recorded-track">
                    {loops.map(loop => (
                        <MidiBlock key={loop.id} loop={loop} />
                    ))}
                </div>
                
                {/* API-Generated MIDI Track */}
                <div className="track api-generated-track">
                    {apiGeneratedLoops.map((loop, index) => (
                        <MidiBlock key={`api-${index}`} loop={loop} />
                    ))}
                </div>

      			{/* Cursor */}
      			<Playhead position={cursor.position} isPlaying={isPlaying} />
    		</div>
			<div>
				<button onClick={handlePlay}>Play</button>
				<button onClick={handleStop}>Stop</button>
			</div>
		</div>
	);
};

export default Timeline;