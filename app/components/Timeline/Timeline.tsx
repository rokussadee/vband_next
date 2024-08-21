import {useEffect} from "react";
import { cursorState, isPlayingState, loopsState, midiNotesState } from "../../lib/state";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { Cursor, MidiNote, MidiLoop } from '../../lib/types';
import { startLoop, stopLoop } from "../../services/ToneService";
import * as Tone from 'tone';
import MidiBlock from "../MidiBlock";
import Playhead from "../Playhead";

export interface TimelineProps {
	width: number,
	height: number, 
	numMeasures: number,
	numBeatsPerMeasure: number
}

const Timeline: React.FC<TimelineProps> = ({width, height, numMeasures, numBeatsPerMeasure}) => {
	const midiNotes = useRecoilValue<Array<MidiNote>>(midiNotesState);
	const loops = useRecoilValue<Array<MidiLoop>>(loopsState);
	const cursor = useRecoilValue<Cursor>(cursorState);
	const isPlaying = useRecoilValue<boolean>(isPlayingState);
	const setCursorPosition = useSetRecoilState<Cursor>(cursorState);
	const setLoops = useSetRecoilState(loopsState);
	
	
	useEffect(() => {
		if (midiNotes && midiNotes.length > 0) {
			const newLoops: MidiLoop[] = generateLoopsFromMidiNotes(midiNotes);
			setLoops(newLoops);
			console.log(`loops updated:`);
			newLoops.forEach((midiLoop) => {
				console.log(JSON.stringify(midiLoop) + "\n");
			})
		}
	}, [midiNotes, setLoops])

	const generateLoopsFromMidiNotes = (notes: Array<MidiNote>): MidiLoop[] => {
		const loop: MidiLoop = {
			id: "loop1", 
			start: notes[0].start, 
			end: Tone.Time(Tone.Time(notes[notes.length - 1].start).toSeconds() + Tone.Time(notes[notes.length - 1].length).toSeconds()).toBarsBeatsSixteenths(), 
			notes: notes};
		return [loop];
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
				{/* Loops */}
        		{loops.map(loop => (
        		  <MidiBlock key={loop.id} loop={loop} />
        		))}
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