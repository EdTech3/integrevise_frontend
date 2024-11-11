"use client";

import { Button } from '@/components/ui/button';
import useDeepgramSTT from '@/hooks/useDeepgramSTT';
import React, { useState } from 'react';
import useMediaDevices from '../../facial_recognition/hooks/useMediaDevices';
import AudioSelector from './AudioSelector';
import { Card } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import AudioVisualizer from '@/components/shared/Audiovisualizer';
import useApiKey from '@/hooks/useDeepgramTempAPIKey';


const SpeechRecognition: React.FC = () => {
    const { apiKey } = useApiKey()
    const { transcript, isListening, error, audioStream, startListening, stopListening } = useDeepgramSTT(apiKey);
    const [deviceId, setDeviceId] = useState<string | null>(null)
    const devices = useMediaDevices(deviceId, setDeviceId, "audioinput")

    const router = useRouter()

    const handleButtonClick = () => {
        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    };

    const getTranscribeButtonText = () => {
        if (isListening) {
            return "Stop Microphone Test"
        } else if (!isListening && transcript) {
            return "Restart Microphone Test"
        } else {
            return "Start Microphone Test"
        }
    }

    return (
        <Card className='w-full mx-auto mt-10 p-6 flex flex-col space-y-14'>
            <AudioSelector setDeviceId={setDeviceId} deviceId={deviceId} devices={devices} />

            <div className='flex flex-col items-center space-y-8'>
                {transcript && <p className="text-center text-base sm:text-lg leading-tight text-foreground">{transcript}</p>}
                {!transcript && !isListening && <p className='text-center text-base sm:text-lg whitespace-pre-wrap leading-tight text-foreground'>Your transcribed text will appear here</p>}
                {!transcript && isListening &&
                    <p className="text-center text-base sm:text-lg whitespace-pre-wrap leading-tight text-foreground">
                        Listening...
                    </p>
                }

                <AudioVisualizer
                    audioStream={audioStream}
                    isListening={isListening}
                    containerClassName='w-full lg:w-1/2'
                    height={150}
                    lineWidth={1}
                    strokeStyle="#203640"
                />

                <div className='space-y-2.5 w-full'>
                    <Button
                        variant={"outline"}
                        onClick={handleButtonClick}
                        className={`text-center w-full text-foreground ${isListening ? "bg-amber-400 hover:bg-amber-400/90" : ""}`}
                    >
                        {getTranscribeButtonText()}
                    </Button>
                    <Button
                        disabled={!transcript}
                        onClick={() => router.push("/viva")}
                        className="text-center w-full"
                    >
                        Start Assessment
                    </Button>

                </div>

                {error && (
                    <p className="text-red-500">Error: {error.message}</p>
                )}
            </div>
        </Card>
    );
};

export default SpeechRecognition