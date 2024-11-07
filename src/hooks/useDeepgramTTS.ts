import { useState } from 'react';

interface UseDeepgramTTSResult {
  convertToSpeech: (text: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export function useDeepgramTTS(): UseDeepgramTTSResult {
  const [isLoading, setIsLoading] = useState(false);
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
      
      audio.play();
      
      audio.addEventListener('ended', () => {
        window.URL.revokeObjectURL(url);
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return { convertToSpeech, isLoading, error };
}