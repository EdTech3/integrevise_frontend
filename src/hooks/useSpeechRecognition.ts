import { useCallback, useEffect, useRef, useState } from 'react';

interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    start(): void;
    stop(): void;
    onresult: (event: SpeechRecognitionEvent) => void;
    onerror: (event: SpeechRecognitionErrorEvent) => void;
    onend: () => void;
  }
  
  interface SpeechRecognitionEvent {
    resultIndex: number;
    results: {
        [key: number]: {
            [key: number]: {
                transcript: string;
            };
        };
    };
}

interface SpeechRecognitionErrorEvent {
    error: string;
}

declare global {
    interface Window {
        SpeechRecognition: new () => SpeechRecognition;
        webkitSpeechRecognition: new () => SpeechRecognition;
    }
}

interface UseSpeechRecognitionProps {
    deviceId?: string;
    continuous?: boolean;
    interimResults?: boolean;
    lang?: string;
}

const useSpeechRecognition = ({
    deviceId,
    continuous = true,
    interimResults = true,
    lang = 'en-US'
}: UseSpeechRecognitionProps = {}) => {
    const [transcript, setTranscript] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const streamRef = useRef<MediaStream | null>(null);

    // Initialize speech recognition
    useEffect(() => {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            setError(new Error('Speech recognition is not supported in this browser'));
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        
        if (recognitionRef.current) {
            recognitionRef.current.continuous = continuous;
            recognitionRef.current.interimResults = interimResults;
            recognitionRef.current.lang = lang;
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
            streamRef.current?.getTracks().forEach(track => track.stop());
        };
    }, [continuous, interimResults, lang]);

    const startListening = useCallback(async () => {
        if (!recognitionRef.current) {
            setError(new Error('Speech recognition is not initialized'));
            return;
        }

        try {
            // First get audio permission if deviceId is specified
            if (deviceId) {
                const stream = await navigator.mediaDevices.getUserMedia({
                    audio: {
                        deviceId: { exact: deviceId }
                    }
                });
                streamRef.current = stream;
            }

            setError(null);
            setTranscript('');
            setIsListening(true);

            recognitionRef.current.onresult = (event) => {
                const current = event.resultIndex;
                const transcript = event.results[current][0].transcript;
                setTranscript(prev => prev + ' ' + transcript);
            };

            recognitionRef.current.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                setError(new Error(event.error));
                setIsListening(false);
            };

            recognitionRef.current.onend = () => {
                if (isListening) {
                    recognitionRef.current?.start();
                }
            };

            recognitionRef.current.start();
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err : new Error('An unknown error occurred'));
            setIsListening(false);
        }
    }, [deviceId, isListening]);

    const stopListening = useCallback(() => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
        streamRef.current?.getTracks().forEach(track => track.stop());
        setIsListening(false);
        streamRef.current = null;
    }, []);

    useEffect(() => {
        return () => {
            stopListening();
        };
    }, [stopListening]);

    return {
        transcript,
        isListening,
        error,
        startListening,
        stopListening,
        audioStream: streamRef.current
    };
};

export default useSpeechRecognition;
