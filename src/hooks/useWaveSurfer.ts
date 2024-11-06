import { useEffect, useRef } from "react";
import WaveSurfer from "wavesurfer.js";
import RecordPlugin from "wavesurfer.js/dist/plugins/record.js";

// Custom hook to initialize WaveSurfer
const useWaveSurfer = (waveSurferContainer: string) => {
    const waveSurferRef = useRef<WaveSurfer | null>(null);
    const recordPluginRef = useRef<RecordPlugin | null>(null);
  
    useEffect(() => {
      const ws = WaveSurfer.create({
        container: waveSurferContainer,
        waveColor: 'hsl(199, 33%, 19%)',
        cursorWidth: 0,
        barGap: 2, 
        height: "auto"
      });
  
      const record = ws.registerPlugin(RecordPlugin.create({
        scrollingWaveform: false,
        renderRecordedAudio: false,
      }));
  
      waveSurferRef.current = ws;
      recordPluginRef.current = record;
  
      return () => {
        ws.destroy();
      };
    }, [waveSurferContainer]);
  
    return { waveSurfer: waveSurferRef.current, recordPlugin: recordPluginRef.current };
  };

  export default useWaveSurfer