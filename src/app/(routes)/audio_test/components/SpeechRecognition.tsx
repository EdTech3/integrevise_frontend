"use client";

import React from 'react';
import useDeepgramSTT from '@/hooks/useDeepgramSTT';

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
        <div className="p-4 bg-gray-100 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Speech Recognition</h2>
            <button
                onClick={handleButtonClick}
                className="px-4 py-2 bg-blue-500 text-white rounded-md"
            >
                {isListening ? 'Stop Listening' : 'Start Listening'}
            </button>
            {error && <p className="text-red-500 mt-2">Error: {error.message}</p>}
            <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Transcript:</h3>
                <p className="whitespace-pre-wrap">{transcript}</p>
            </div>
        </div>
    );
};

export default SpeechRecognition;