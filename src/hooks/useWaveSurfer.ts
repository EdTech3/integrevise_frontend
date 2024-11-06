import { useEffect, useRef } from "react";
import WaveSurfer, { WaveSurferOptions } from "wavesurfer.js";
import RecordPlugin from "wavesurfer.js/dist/plugins/record.js";

// Custom hook to initialize WaveSurfer
const useWaveSurfer = (waveSurferOptions: WaveSurferOptions) => {
    const waveSurferRef = useRef<WaveSurfer | null>(null);
    const recordPluginRef = useRef<RecordPlugin | null>(null);
  
    useEffect(() => {
      const ws = WaveSurfer.create(waveSurferOptions)
  
      const record = ws.registerPlugin(RecordPlugin.create({
        scrollingWaveform: false,
        renderRecordedAudio: false,
      }));
  
      waveSurferRef.current = ws;
      recordPluginRef.current = record;
  
      return () => {
        ws.destroy();
      };
    }, [waveSurferOptions]);
  
    return { waveSurfer: waveSurferRef.current, recordPlugin: recordPluginRef.current };
  };

  export default useWaveSurfer