import { useCallback, useEffect, useState, useRef } from 'react';
import { createClient, LiveTranscriptionEvents, type LiveClient } from '@deepgram/sdk';
import WaveSurfer from 'wavesurfer.js';
import RecordPlugin from 'wavesurfer.js/dist/plugins/record.esm.js';

interface UseDeepGramSTTResult {
  transcript: string;
  isListening: boolean;
  error: Error | null;
  audioURL: string | null;
  wavesurfer: WaveSurfer | null;
  startListening: () => Promise<void>;
  stopListening: () => void;
}

// Custom hook to fetch API key
const useApiKey = () => {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        const response = await fetch('api/key');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to get API key');
        }

        setApiKey(data.key);
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      }
    };

    fetchApiKey();
  }, []);

  return { apiKey, error };
};

// Custom hook to initialize WaveSurfer
const useWaveSurfer = () => {
  const waveSurferRef = useRef<WaveSurfer | null>(null);
  const recordPluginRef = useRef<RecordPlugin | null>(null);

  useEffect(() => {
    const ws = WaveSurfer.create({
      container: '#waveform',
      waveColor: 'rgb(200, 0, 200)',
      progressColor: 'rgb(100, 0, 100)',
      height: 100,
      barWidth: 2,
      barGap: 2,
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
  }, []);

  return { waveSurfer: waveSurferRef.current, recordPlugin: recordPluginRef.current };
};

// Custom hook to manage Deepgram live client
const useDeepgramLiveClient = (
  apiKey: string | null,
  onTranscript: (transcript: string) => void,
  onError: (error: Error) => void
) => {
  const liveClientRef = useRef<LiveClient | null>(null);

  const initDeepgram = useCallback(() => {
    return new Promise<void>((resolve, reject) => {
      if (!apiKey) {
        reject(new Error('API key is not available'));
        return;
      }
  
      const deepgram = createClient(apiKey);
      const live = deepgram.listen.live({
        language: 'en-GB',
        model: 'nova',
        smart_format: true,
        diarize: true,
        filler_words: true,
        measurements: true,
        profanity_filter: false,
        keywords: ['integrevise'],
      });
  
      live.on(LiveTranscriptionEvents.Open, () => {
        console.log('Connection opened');
        resolve();
      });
  
      live.on(LiveTranscriptionEvents.Error, (error) => {
        console.error('Deepgram error:', error);
        onError(new Error('Transcription error'));
        reject(error);
      });
  
      live.on(LiveTranscriptionEvents.Transcript, (data) => {
        const transcriptPart = data.channel?.alternatives?.[0]?.transcript;
        if (transcriptPart) {
          onTranscript(transcriptPart);
        }
      });
  
      liveClientRef.current = live;
    });
  }, [apiKey, onTranscript, onError]);

  return { liveClientRef, initDeepgram };
};

// Custom hook to handle media recording
const useMediaRecorder = (
  liveClientRef: React.MutableRefObject<LiveClient | null>,
  onAudioData: (url: string) => void,
  onError: (error: Error) => void
) => {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = useCallback((stream: MediaStream) => {
    try {
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus',
      });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
          if (liveClientRef.current?.getReadyState() === WebSocket.OPEN) {
            liveClientRef.current.send(event.data);
          }
        }
      };

      mediaRecorder.onstop = () => {
        if (liveClientRef.current?.getReadyState() === WebSocket.OPEN) {
          liveClientRef.current.requestClose();
        }

        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm;codecs=opus' });
        const url = URL.createObjectURL(audioBlob);
        onAudioData(url);
        audioChunksRef.current = [];
      };

      mediaRecorder.start(250);
    } catch (err) {
      console.error(err);
      onError(err instanceof Error ? err : new Error('An unknown error occurred'));
    }
  }, [liveClientRef, onAudioData, onError]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current?.state !== 'inactive') {
      mediaRecorderRef.current?.stop();
    }
  }, []);

  return { startRecording, stopRecording };
};

const useDeepgramSTT = (): UseDeepGramSTTResult => {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const { apiKey } = useApiKey();
  const { waveSurfer, recordPlugin } = useWaveSurfer();
  const { liveClientRef, initDeepgram } = useDeepgramLiveClient(
    apiKey,
    (part) => setTranscript((prev) => prev + ' ' + part),
    setError
  );
  const { startRecording, stopRecording } = useMediaRecorder(
    liveClientRef,
    setAudioURL,
    setError
  );


  const startListening = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia || !apiKey) {
      setError(new Error('Required APIs are not available'));
      return;
    }
  
    try {
      setError(null);
      setTranscript('');
      setIsListening(true);
      setAudioURL(null);
  
      await initDeepgram(); // Wait for Deepgram connection
  
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
  
      await recordPlugin?.startRecording();
      startRecording(stream);
  
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      setIsListening(false);
    }
  }, [apiKey, initDeepgram, recordPlugin, startRecording]);

  const stopListening = useCallback(() => {
    stopRecording();
    liveClientRef.current?.requestClose();
    recordPlugin?.stopRecording();
    streamRef.current?.getTracks().forEach((track) => track.stop());
    setIsListening(false);
    streamRef.current = null;
  }, [stopRecording, liveClientRef, recordPlugin]);

  useEffect(() => {
    return () => {
      stopListening();
    };
  }, [stopListening]);

  return {
    transcript,
    isListening,
    error,
    audioURL,
    wavesurfer: waveSurfer,
    startListening,
    stopListening,
  };
};

export default useDeepgramSTT;