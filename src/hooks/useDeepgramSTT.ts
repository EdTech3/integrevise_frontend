import { useCallback, useEffect, useState } from 'react';

interface UseDeepgramSTTResult {
  transcript: string;
  isListening: boolean;
  error: Error | null;
  startListening: () => Promise<void>;
  stopListening: () => void;
}

const useDeepgramSTT = (): UseDeepgramSTTResult => {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [deepgramSocket, setDeepgramSocket] = useState<WebSocket | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL

  const startListening = useCallback(async () => {
    if (!navigator.mediaDevices.getUserMedia) {
      setError(new Error('getUserMedia is not supported in this browser'));
      return;
    }

    try {
      setError(null);
      setTranscript('');
      setIsListening(true);

      // Fetch temporary API key from the backend
      const response = await fetch(`${backendUrl}/key`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get API key');
      }

      const apiKey = data.key;

      // Get microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm;codecs=opus' });

      // Open WebSocket connection
      const deepgramSocket = new WebSocket(`wss://api.deepgram.com/v1/listen?language=en-US&model=nova&smart_format=true`, ['token', apiKey]);

      deepgramSocket.onopen = () => {
        console.log('WebSocket connection opened');
        mediaRecorder.start(250);
      };

      deepgramSocket.onmessage = (message) => {
        const data = JSON.parse(message.data);
        if (data.channel && data.channel.alternatives && data.channel.alternatives[0]) {
          const { transcript } = data.channel.alternatives[0];
          if (transcript) {
            setTranscript((prev) => prev + ' ' + transcript);
          }
        }
      };

      deepgramSocket.onerror = (event) => {
        console.error('WebSocket error', event);
        setError(new Error('WebSocket error'));
        setIsListening(false);
      };

      deepgramSocket.onclose = () => {
        console.log('WebSocket connection closed');
        setIsListening(false);
      };

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0 && deepgramSocket.readyState === WebSocket.OPEN) {
          deepgramSocket.send(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        if (deepgramSocket.readyState === WebSocket.OPEN) {
          deepgramSocket.close();
        }
      };

      setMediaRecorder(mediaRecorder);
      setDeepgramSocket(deepgramSocket);
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      setIsListening(false);
    }
  }, [backendUrl]);

  const stopListening = useCallback(() => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
    }
    if (deepgramSocket && deepgramSocket.readyState === WebSocket.OPEN) {
      deepgramSocket.close();
    }
    setIsListening(false);
    setMediaRecorder(null);
    setDeepgramSocket(null);
  }, [mediaRecorder, deepgramSocket]);

  useEffect(() => {
    return () => {
      if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
      }
      if (deepgramSocket && deepgramSocket.readyState === WebSocket.OPEN) {
        deepgramSocket.close();
      }
    };
  }, [mediaRecorder, deepgramSocket]);

  return {
    transcript,
    isListening,
    error,
    startListening,
    stopListening,
  };
};

export default useDeepgramSTT;