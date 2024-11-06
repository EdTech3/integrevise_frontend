import { createClient, LiveTranscriptionEvents, type LiveClient } from '@deepgram/sdk';
import { useCallback, useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import useWaveSurfer from './useWaveSurfer';

interface UseDeepGramSTTResult {
  transcript: string;
  isListening: boolean;
  error: Error | null;
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
      };

      mediaRecorder.start(250);
    } catch (err) {
      console.error(err);
      onError(err instanceof Error ? err : new Error('An unknown error occurred'));
    }
  }, [liveClientRef, onError]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current?.state !== 'inactive') {
      mediaRecorderRef.current?.stop();
    }
  }, []);

  return { startRecording, stopRecording };
};

const useDeepgramSTT = (waveSurferContainer: string, deviceId?: string): UseDeepGramSTTResult => {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const { apiKey } = useApiKey();
  const { waveSurfer, recordPlugin } = useWaveSurfer(waveSurferContainer)
  const { liveClientRef, initDeepgram } = useDeepgramLiveClient(
    apiKey,
    (part) => setTranscript((prev) => prev + ' ' + part),
    setError
  )

  const { startRecording, stopRecording } = useMediaRecorder(
    liveClientRef,
    setError
  );


  const startListening = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setError(new Error('Could not access microphone'));
      return;
    }

    if (!apiKey) {
      console.warn('API key is either loading or not available');
      return;
    }
  
    try {
      setError(null);
      setTranscript('');
      setIsListening(true);
  
      await initDeepgram(); // Wait for Deepgram connection
      
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          deviceId: deviceId ? { exact: deviceId } : undefined,
        },
      });
      streamRef.current = stream;
  
      await recordPlugin?.startRecording();
      startRecording(stream);
  
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      setIsListening(false);
    }
  }, [apiKey, deviceId, initDeepgram, recordPlugin, startRecording]);

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
    wavesurfer: waveSurfer,
    startListening,
    stopListening,
  };
};

export default useDeepgramSTT;