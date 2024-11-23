import { infoToast } from '@/lib/toast';
import { createClient, LiveTranscriptionEvents, type LiveClient } from '@deepgram/sdk';
import { useCallback, useEffect, useRef, useState } from 'react';

// Custom hook to manage Deepgram live client
const useDeepgramLiveClient = (
  apiKey: string | null,
  onTranscript: (transcript: string) => void,
  onError: (error: Error) => void,
  onSpeechEnd?: (lastWordEnd: number) => void
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
        language: 'en-US',
        model: 'nova',
        smart_format: true,
        filler_words: true,
        measurements: true,
        profanity_filter: false,
        interim_results: true,
        utterance_end_ms: 3000,
        keywords: ['integrevise']
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
        if (transcriptPart && transcriptPart.trim()) {
          if (!data.is_final) {
            onTranscript(transcriptPart);
          } else {
            onTranscript('\n' + transcriptPart);
          }
        }
      });
  
      live.on('UtteranceEnd', (data) => {
        if (onSpeechEnd && data.last_word_end) {
          onSpeechEnd(data.last_word_end);
        }
      });
  
      liveClientRef.current = live;
    });
  }, [apiKey, onTranscript, onError, onSpeechEnd]);

  return { liveClientRef, initDeepgram };
};

// Custom hook to handle media recording
const useMediaRecorder = (
  liveClientRef: React.MutableRefObject<LiveClient | null>,
  onError: (error: Error) => void
) => {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const startRecording = useCallback((stream: MediaStream) => {
    try {
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus',
      });

      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
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

      mediaRecorder.start(150);
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

  return { startRecording, stopRecording, mediaRecorder: mediaRecorderRef.current };
};

const useDeepgramSTT = (apiKey: string | null, deviceId?: string) => {
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [lastSpeechEnd, setLastSpeechEnd] = useState<number | null>(null);
  const [hasStopped, setHasStopped] = useState(false);

  const { liveClientRef, initDeepgram } = useDeepgramLiveClient(
    apiKey,
    (part) => {
      if (part.startsWith('\n')) {
        setInterimTranscript('');
        setTranscript(prev => prev + part);
      } else {
        setInterimTranscript(part);
        setHasStopped(false);
      }
    },
    setError,
    (lastWordEnd) => {
      setLastSpeechEnd(lastWordEnd);
      setHasStopped(true);
    }
  );

  const { startRecording, stopRecording, mediaRecorder } = useMediaRecorder(
    liveClientRef,
    setError
  );


  const startListening = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setError(new Error('Could not access microphone'));
      return;
    }

    if (!apiKey) {
      infoToast('Creating a secure session...');
      return;
    }
  
    try {
      setError(null);
      setTranscript('');
      setIsListening(true);
      setHasStopped(false);
  
      await initDeepgram(); // Wait for Deepgram connection
      
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          deviceId: deviceId ? { exact: deviceId } : undefined,
        },
      });
      streamRef.current = stream;
  
      startRecording(stream);
  
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      setIsListening(false);
    }
  }, [apiKey, deviceId, initDeepgram, startRecording]);

  const stopListening = useCallback(() => {
    stopRecording();
    liveClientRef.current?.requestClose();
    streamRef.current?.getTracks().forEach((track) => track.stop());
    setIsListening(false);
    streamRef.current = null;
  }, [stopRecording, liveClientRef]);

  useEffect(() => {
    return () => {
      stopListening();
    };
  }, [stopListening]);

  return {
    transcript: transcript + (interimTranscript ? ' ' + interimTranscript : ''),
    finalTranscript: transcript,
    isListening,
    error,
    startListening,
    stopListening,
    mediaRecorder,
    audioStream: streamRef.current,
    lastSpeechEnd,
    hasStopped,
  };
};

export default useDeepgramSTT;