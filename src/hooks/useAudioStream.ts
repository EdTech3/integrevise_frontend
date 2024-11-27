import { useCallback, useRef } from 'react';

const useAudioStream = (deviceId?: string) => {
  const streamRef = useRef<MediaStream | null>(null);

  const startStream = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      throw new Error('Could not access microphone');
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          deviceId: deviceId ? { exact: deviceId } : undefined,
        },
      });
      streamRef.current = stream;
      return stream;
    } catch (err) {
      console.error('Error accessing microphone:', err);
      throw err;
    }
  }, [deviceId]);

  const pauseStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.enabled = false;
      });
    }
  }, []);

  const resumeStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.enabled = true;
      });
    }
  }, []);

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }, []);

  return {
    stream: streamRef.current,
    startStream,
    pauseStream,
    resumeStream,
    stopStream
  };
};

export default useAudioStream;
