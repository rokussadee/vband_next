import { MidiLoop } from '../../lib/types';
import * as Tone from 'tone';

interface MidiBlockProps {
  loop: MidiLoop;
}

const MidiBlock: React.FC<MidiBlockProps> = ({ loop }) => {
  // Assuming each grid column represents a sixteenth note for this example
  const startColumn = Tone.Time(loop.start).toTicks(); // Number of ticks from the start of the timeline
  const endColumn = Tone.Time(loop.end).toTicks();

  return (
    <div
      className="absolute h-full bg-blue-500 bg-opacity-50"
      style={{
        gridColumnStart: startColumn,
        gridColumnEnd: endColumn,
      }}
    >
      {loop.notes.map((note, index) => {
          const noteStartColumn = Tone.Time(note.start).toTicks();
          //console.log(`noteStartColumn: ${noteStartColumn}`);
          const noteLengthInTicks = Tone.Time(note.length).toTicks();
          //console.log(`noteLengthInTicks: ${noteLengthInTicks}`);
          const gridRow = note.note + 1;
          return (
            <div
              key={index}
              className="absolute bg-red-500 bg-opacity-70"        
              style={{
                gridColumnStart: noteStartColumn,
                gridColumnEnd: noteStartColumn + noteLengthInTicks,
                gridRowStart: gridRow,  // Assuming note.note determines vertical positioning
                gridRowEnd: gridRow + 1
              }}
            >
          Note: {note.note}
        </div>
      );
    })}
    </div>
  );
};

export default MidiBlock;
