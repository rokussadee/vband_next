import { midiNotesState } from "@/app/lib/state";
import { useEffect, useRef } from "react";
import { useRecoilValue } from "recoil";
import { MidiNote } from '../../lib/state';

export interface TimelineProps {
	width: number,
	height: number, 
	numMeasures: number,
	numBeatsPerMeasure: number
}

const Timeline: React.FC<TimelineProps> = ({width, height, numMeasures, numBeatsPerMeasure}) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const midiNotes = useRecoilValue<MidiNote[]>(midiNotesState);
	
	console.log("midiNotes in Timeline, from recoil value: ", midiNotes);
	
	useEffect(() => {
		const canvas = canvasRef.current;
		const ctx = canvas?.getContext('2d');
		
		if (ctx && canvas) {
			
			canvas.height = height;
			canvas.width = width;
			ctx.clearRect(0, 0, width, height);
			
			const pixelsPerBeat = width / (numBeatsPerMeasure * numMeasures);

			ctx.strokeStyle = '#fff';

			for (let measure = 0; measure < numMeasures; measure++) {
				for (let beat = 0; beat < numBeatsPerMeasure; beat++) {
					const x = (measure * numBeatsPerMeasure + beat) * pixelsPerBeat;
					ctx.lineWidth = beat === 0 ? 2 : 1;
					ctx.moveTo(x, 0);
					ctx.lineTo(x, height);
					ctx.stroke();
				}
			}

			midiNotes.forEach((note) => {
				const x = note.time * pixelsPerBeat
				const y = (height - 20) * (1 - note.note / 127);
				ctx.fillStyle = '#00d8ff';
				ctx.fillRect(x, y, pixelsPerBeat, 20);

			});

		}

	}, [midiNotes, width, height, numMeasures, numBeatsPerMeasure]);
	
	return (
		<div>
			<canvas ref={canvasRef} className="" ></canvas>
		</div>
	);
};

export default Timeline;