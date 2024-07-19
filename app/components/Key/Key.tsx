import _ from 'lodash';
import React from 'react';
import { NOTE_TO_KEY } from '../../global/constants';

interface KeyProps {
  note: string;
  pressedKeys: string[];
}

const Key: React.FC<KeyProps> = ({ note, pressedKeys }) => {
  const noteIsFlat = (note: string) => {
    return note.length >2;
  };

  const keyIsPressed = (note: string, pressedKeys: string[]) => {
    return _.includes(pressedKeys, NOTE_TO_KEY[note]);
  };

  let keyClassName = "key";
  const isFlat = noteIsFlat(note);
  const isPressed = keyIsPressed(note, pressedKeys);


  const keyClasses = `
    ${isFlat ? 'bg-black' : 'bg-white'}
    border-2 border-black
    ${isFlat ? 'relative ml-[-17px] mr-[-17px] h-60 w-10 z-2' : 'w-20 h-80'}
    ${isPressed ? 'bg-blue-400' : ''}
  `;

  const keyTextClasses = `
    ${isFlat ? 'text-white' : 'text-black'}
    font-semibold text-3xl
    ${isFlat ? 'absolute top-24 left-1/2 transform -translate-x-1/2' : 'relative mt-24'}
  `;

  return (
    <div className={keyClasses}>
      {!isFlat && (
        <div className={keyTextClasses}>
          {note.toUpperCase()}
        </div>
      )}
    </div>
  );
};

export default Key;
