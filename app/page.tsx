"use client";

import RecordingButton from "./components/RecordingButton";
import MidiComponent from "./components/MidiComponent";
import SettingsForm from "./components/SettingsForm";
import InstrumentSelector from './components/InstrumentSelector';
import Piano from "./components/Piano";
import Timeline from "./components/Timeline";
import { useEffect } from "react";
import { initAssistant, openThread } from "./services/MidiGenService";
import { openaiClientState, threadState } from "./lib/state";
import { useSetRecoilState } from "recoil";
import OpanAI from "openai";
import axios from 'axios';

export default function Home() {
  const setCurrentThreadID = useSetRecoilState<string | null>(threadState);
  const setClient = useSetRecoilState<OpanAI| null>(openaiClientState)
  const handleSaveSettings = (bpm: number, measures: number) => {
    // Implement logic to save BPM and number of measures
    console.log('BPM:', bpm);
    console.log('Number of Measures:', measures);
  };

  useEffect(() => {
    (async () => {
      console.log("useEffect for API connection called.")
      try {
        const assistant = await initAssistant();
        console.log(assistant);
        if (assistant) {
          const thread = await openThread();
          console.log(thread);
          if (thread) {
            setCurrentThreadID(thread.id);
          } else {
            console.error("Failed to create a thread.");
          }
        } else {
          console.error("Failed to initialize the assistant.");
        }
      }
      catch (err) {
        console.error("Unsuccessful connection to the OpenAI Assistants API.", err);
      }
    })();
  }, []);

    return (
      <main className="flex min-h-screen  overflow-hidden flex-col items-center justify-between">
      <img src="./blurpath2_fullwidth.png" alt="rokus sadee" className="absolute z-0  overflow-hidden" />
      <div className="z-10 p-6  border-2 drop-shadow-xl overflow-hidden backdrop-blur-xl radius-10 rounded-2xl border-neutral-300 mt-6">
          <div className="flex justify-between ml-4">
            {/* <div className="text-7xl font-semibold"><span className="font-black">V</span>Band</div> */}
            <div className="font-semibold text-7xl flex items-center">
              <img src="./vlogo.png" width="100" className="overflow-hidden max-h-screen" alt="logo Vband" />
              <span className="font-black">V</span>Band
            </div>
          <div className="flex  p-4 pl-0 row-auto">
            <RecordingButton/>
            {/* <MidiComponent/> */}
          </div>
          </div>
        <div className="flex mt-4 justify-between relative flex-row place-items-center">
          <div className="flex row-auto">
            <SettingsForm onSave={handleSaveSettings} />
          </div>
        </div>
        <div className="flex mt-6">
          <div className="p-4 pt-0 row-auto">
            <InstrumentSelector />
            <Piano />
          </div>
          <div className="z-10 p-4">
            <Timeline width={800} height={200} numBeatsPerMeasure={4} numMeasures={4}/>
          </div>

        </div>
      </div>
    </main>
  );
}
 