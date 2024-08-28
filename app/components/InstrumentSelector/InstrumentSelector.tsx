"use client";
export interface InstrumentSelectorProps {}

import React from 'react';
import { useRecoilState } from 'recoil';
import { instrumentState } from '../../lib/state';

const InstrumentSelector: React.FC = () => {
  const [instrument, setInstrument] = useRecoilState(instrumentState);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setInstrument(event.target.value);
  };

  return (
    <div className='mb-2'>
    <label htmlFor="instrument">Select Instrument: </label>
    <select id="instrument" className='text-black font-bold' value={instrument} onChange={handleChange}>
      <option className='font-bold' value="piano">Piano</option>
      <option className='font-bold' value="synth">Synth</option>
      <option className='font-bold' value="guitar">Guitar</option>
      {/* Add more options as needed */}
    </select>
  </div>
  );
};

export default InstrumentSelector;
