"use client";

import Image from "next/image";
import RecordingButton from "./components/RecordingButton";
import MidiComponent from "./components/MidiComponent";
import SettingsForm from "./components/SettingsForm";
import InstrumentSelector from './components/InstrumentSelector';
import Piano from "./components/Piano";

export default function Home() {
  const handleSaveSettings = (bpm: number, measures: number) => {
    // Implement logic to save BPM and number of measures
    console.log('BPM:', bpm);
    console.log('Number of Measures:', measures);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">

      <div className="flex relative z-40 flex-row place-items-center">
        <div className="flex row-auto">
          <RecordingButton/>
          <MidiComponent/>
        </div>
        <div className="flex row-auto">
          <InstrumentSelector />
          <SettingsForm onSave={handleSaveSettings} />
        </div>
      </div>
      <div className="flex row-auto">
        <Piano />
      </div>

    </main>
  );
}
