// components/SettingsForm.tsx
"use client";

import React, { useState } from 'react';

const SettingsForm: React.FC<{
  onSave: (bpm: number, measures: number) => void;
}> = ({ onSave }) => {
  const [bpm, setBpm] = useState<number>(120); // Initial BPM value
  const [measures, setMeasures] = useState<number>(4); // Initial number of measures

  const handleSave = () => {
    onSave(bpm, measures);
  };

  return (
    <div className="backdrop-blur-xl rounded-2xl m-4">
    <label htmlFor="bpmInput" className="block mb-2 font-semibold">
      BPM:
      <input
        id="bpmInput"
        type="number"
        value={bpm}
        onChange={(e) => setBpm(parseInt(e.target.value))}
        className="ml-2 border-2 border-red-300 p-1 pl-3 rounded-full  text-black font-Helvetica"
      />
    </label>
    <label htmlFor="measuresInput" className="block mb-2 font-semibold">
      Number of Measures:
      <input
        id="measuresInput"
        type="number"
        value={measures}
        onChange={(e) => setMeasures(parseInt(e.target.value))}
        className="ml-2 border-2 border-red-300 rounded-full p-1 pl-3 text-black font-Helvetica"
      />
    </label>
    <button onClick={handleSave} className="mt-2 bg-neutral-700 text-white px-4 py-2 rounded-full font-semibold hover:drop-shadow-lg">
      Update settings
    </button>
  </div>
  );
};

export default SettingsForm;
