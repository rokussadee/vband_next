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
    <div>
      <label htmlFor="instrument">Select Instrument: </label>
      <select id="instrument" value={instrument} onChange={handleChange}>
        <option value="piano">Piano</option>
        <option value="synth">Synth</option>
        <option value="guitar">Guitar</option>
        {/* Add more options as needed */}
      </select>
    </div>
  );
};

export default InstrumentSelector;
