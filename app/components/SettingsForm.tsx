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
    <div className="p-4 border-2 border-gray-300">
      <label htmlFor="bpmInput" className="block mb-2">
        BPM:
        <input
          id="bpmInput"
          type="number"
          value={bpm}
          onChange={(e) => setBpm(parseInt(e.target.value))}
          className="ml-2 border-2 border-gray-400 p-1 text-black"
        />
      </label>
      <label htmlFor="measuresInput" className="block mb-2">
        Number of Measures:
        <input
          id="measuresInput"
          type="number"
          value={measures}
          onChange={(e) => setMeasures(parseInt(e.target.value))}
          className="ml-2 border-2 border-gray-400 p-1 text-black"
        />
      </label>
      <button onClick={handleSave} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Save Settings
      </button>
    </div>
  );
};

export default SettingsForm;
