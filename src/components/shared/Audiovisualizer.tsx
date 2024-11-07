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

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const canvasContext = canvas.getContext('2d')!;

        const resizeCanvas = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = height;
        };

        const drawFlatLine = () => {
            const WIDTH = canvas.width;
            const HEIGHT = canvas.height;
            canvasContext.clearRect(0, 0, WIDTH, HEIGHT);
            canvasContext.lineWidth = lineWidth;
            canvasContext.strokeStyle = strokeStyle;
            canvasContext.beginPath();
            canvasContext.moveTo(0, HEIGHT / 2);
            canvasContext.lineTo(WIDTH, HEIGHT / 2);
            canvasContext.stroke();
        };

        const draw = () => {
            const WIDTH = canvas.width;
            const HEIGHT = canvas.height;
            animationFrameIdRef.current = requestAnimationFrame(draw);

            analyser.getByteTimeDomainData(dataArray);

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
        };

        resizeCanvas();
        drawFlatLine(); // Always draw a flat line initially

        if (!audioStream || !isListening) {
            return;
        }

        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const analyser = audioContext.createAnalyser();
        const source = audioContext.createMediaStreamSource(audioStream);

        source.connect(analyser);

        analyser.smoothingTimeConstant = 0.8;
        analyser.fftSize = 1024;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        draw();

        window.addEventListener('resize', resizeCanvas);

        return () => {
            if (animationFrameIdRef.current) {
                cancelAnimationFrame(animationFrameIdRef.current);
            }
            source.disconnect();
            analyser.disconnect();
            audioContext.close();
            window.removeEventListener('resize', resizeCanvas);
        };
    }, [audioStream, isListening, lineWidth, strokeStyle, height]);

    return (
        <div className={containerClassName}>
            <canvas ref={canvasRef} style={{ width: '100%', height: `${height}px` }} />
        </div>
    );
};

export default AudioVisualizer;