import React, { useEffect, useRef } from 'react';

interface AudioVisualizerProps {
    audioStream: MediaStream | null;
    isListening: boolean;
    width?: number;
    height?: number;
    lineWidth?: number;
    strokeStyle?: string;
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
    audioStream,
    isListening,
    width = 500,
    height = 100,
    lineWidth = 2,
    strokeStyle = '#4F46E5',
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationFrameIdRef = useRef<number>();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const canvasContext = canvas.getContext('2d')!;
        const WIDTH = canvas.width;
        const HEIGHT = canvas.height;

        const drawFlatLine = () => {
            canvasContext.clearRect(0, 0, WIDTH, HEIGHT);
            canvasContext.lineWidth = lineWidth;
            canvasContext.strokeStyle = strokeStyle;
            canvasContext.beginPath();
            canvasContext.moveTo(0, HEIGHT / 2);
            canvasContext.lineTo(WIDTH, HEIGHT / 2);
            canvasContext.stroke();
        };

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

        const draw = () => {
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

        draw();

        return () => {
            if (animationFrameIdRef.current) {
                cancelAnimationFrame(animationFrameIdRef.current);
            }
            source.disconnect();
            analyser.disconnect();
            audioContext.close();
        };
    }, [audioStream, isListening, lineWidth, strokeStyle]);

    return <canvas ref={canvasRef} width={width} height={height} />;
};

export default AudioVisualizer;