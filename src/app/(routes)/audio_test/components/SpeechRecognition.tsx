"use client";

import React from 'react';
import useDeepgramSTT from '@/hooks/useDeepgramSTT';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const SpeechRecognition: React.FC = () => {
    const { transcript, isListening, error, startListening, stopListening } = useDeepgramSTT();

    const handleButtonClick = () => {
        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    };

    return (
        <Card className='max-w-2xl w-full mx-auto mt-20 p-6'>
            <div className='flex flex-col items-center space-y-8'>
                {!transcript && <p>Your transcribed text will appear here</p>}
                {transcript && <p className="whitespace-pre-wrap">{transcript}</p>}

                {/* WaveSurfer container */}
                <div id="waveform" className="w-full" />

                <Button
                    onClick={handleButtonClick}
                    className="text-center"
                >
                    {isListening ? 'Stop Recording' : 'Start Recording'}
                </Button>

                {error && (
                    <p className="text-red-500">Error: {error.message}</p>
                )}
            </div>
        </Card>
    );
};

export default SpeechRecognition;