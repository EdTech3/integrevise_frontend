import React, { useEffect, useRef } from 'react';

interface AudioVisualizerProps {
    audioStream: MediaStream | null;
    isListening: boolean;
    height?: number;
    lineWidth?: number;
    strokeStyle?: string;
    containerClassName?: string; // New prop for custom class names
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
    audioStream,
    isListening,
    height = 100,
    lineWidth = 2,
    strokeStyle = '#4F46E5',
    containerClassName = '', // Default to an empty string
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationFrameIdRef = useRef<number>();
    const audioContextRef = useRef<AudioContext>();
    const analyserRef = useRef<AnalyserNode>();
    const sourceRef = useRef<MediaStreamAudioSourceNode>();

    // Initialize audio context and analyzer immediately when stream is available
    useEffect(() => {
        if (!audioStream) {
            return;
        };

        // Create new audio context and analyzer for each stream
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        analyserRef.current = audioContextRef.current.createAnalyser();

        // Adjust analyzer settings for better visualization
        analyserRef.current.smoothingTimeConstant = 0.3; // Reduced from 0.8 for more responsive visualization
        analyserRef.current.fftSize = 2048; // Increased from 1024 for better resolution

        // Create and connect source
        sourceRef.current = audioContextRef.current.createMediaStreamSource(audioStream);
        sourceRef.current.connect(analyserRef.current);

        return () => {
            sourceRef.current?.disconnect();
            audioContextRef.current?.close();
        };
    }, [audioStream]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const canvasContext = canvas.getContext('2d')!;

        const resizeCanvas = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = height;
        };

        const draw = () => {
            const WIDTH = canvas.width;
            const HEIGHT = canvas.height;

            // Draw flat line when analyzer isn't ready or not listening
            if (!analyserRef.current || !isListening || !audioStream) {
                canvasContext.clearRect(0, 0, WIDTH, HEIGHT);
                canvasContext.lineWidth = lineWidth;
                canvasContext.strokeStyle = strokeStyle;
                canvasContext.beginPath();
                canvasContext.moveTo(0, HEIGHT / 2);
                canvasContext.lineTo(WIDTH, HEIGHT / 2);
                canvasContext.stroke();
                animationFrameIdRef.current = requestAnimationFrame(draw);
                return;
            }

            const bufferLength = analyserRef.current.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);

            analyserRef.current.getByteTimeDomainData(dataArray);
            canvasContext.clearRect(0, 0, WIDTH, HEIGHT);

            canvasContext.lineWidth = lineWidth;
            canvasContext.strokeStyle = strokeStyle;
            canvasContext.beginPath();

            const sliceWidth = WIDTH / bufferLength;
            let x = 0;

            for (let i = 0; i < bufferLength; i++) {
                const v = dataArray[i] / 128.0;
                const y = (v * HEIGHT) / 2;

                if (i === 0) {
                    canvasContext.moveTo(x, y);
                } else {
                    canvasContext.lineTo(x, y);
                }

                x += sliceWidth;
            }

            canvasContext.lineTo(WIDTH, HEIGHT / 2);
            canvasContext.stroke();

            animationFrameIdRef.current = requestAnimationFrame(draw);
        };

        resizeCanvas();
        draw();

        window.addEventListener('resize', resizeCanvas);

        return () => {
            if (animationFrameIdRef.current) {
                cancelAnimationFrame(animationFrameIdRef.current);
            }
            window.removeEventListener('resize', resizeCanvas);
        };
    }, [isListening, lineWidth, strokeStyle, height, audioStream]);

    // Cleanup effect
    useEffect(() => {
        return () => {
            audioContextRef.current?.close();
            sourceRef.current?.disconnect();
            analyserRef.current?.disconnect();
        };
    }, []);

    return (
        <div className={containerClassName}>
            <canvas ref={canvasRef} style={{ width: '100%', height: `${height}px` }} />
        </div>
    );
};

export default AudioVisualizer;