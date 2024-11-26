import { useState } from 'react';

export function useDeepgramTTS(onComplete?: () => void) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const convertToSpeech = async (text: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate speech');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const audio = new Audio(url);
      
      audio.addEventListener('play', () => {
        setIsSpeaking(true);
      });
      
      audio.addEventListener('ended', () => {
        setIsSpeaking(false);
        window.URL.revokeObjectURL(url);
        onComplete?.();
      });
      
      await new Promise((resolve) => {
        audio.addEventListener('loadedmetadata', resolve);
      });
      
      const streamDelay = (audio.duration * 1000) / text.length;
      
      return { audio, streamDelay };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { convertToSpeech, isLoading, isSpeaking, error };
}