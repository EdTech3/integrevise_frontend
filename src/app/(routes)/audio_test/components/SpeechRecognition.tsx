"use client";

import { Button } from '@/components/ui/button';
import useDeepgramSTT from '@/hooks/useDeepgramSTT';
import React, { useState } from 'react';
import useMediaDevices from '../../facial_recognition/hooks/useMediaDevices';
import AudioSelector from './AudioSelector';
import { Card } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import AudioVisualizer from '@/components/shared/Audiovisualizer';


const SpeechRecognition: React.FC = () => {
    const { transcript, isListening, error, audioStream, startListening, stopListening } = useDeepgramSTT();
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

    return (
        <Card className='w-full mx-auto mt-10 p-6 flex flex-col space-y-14'>
            <AudioSelector setDeviceId={setDeviceId} deviceId={deviceId} devices={devices} />

            <div className='flex flex-col items-center space-y-8'>
                {!transcript && <p className='text-gray-600 text-lg'>Your transcribed text will appear here</p>}
                {transcript && <p className="whitespace-pre-wrap text-center text-foreground text-lg">{transcript}</p>}


                <AudioVisualizer
                    audioStream={audioStream}
                    isListening={isListening}
                    width={600}
                    height={150}
                    lineWidth={1}
                    strokeStyle="#203640"
                />


                <div className='space-y-2.5 w-full'>
                    <Button
                        variant={"outline"}
                        onClick={handleButtonClick}
                        className="text-center w-full"
                    >
                        {isListening ? 'Stop Recording' : 'Start Recording'}
                    </Button>
                    <Button
                        disabled={!transcript}
                        onClick={() => router.push("/viva")}
                        className="text-center w-full"
                    >
                        Continue
                    </Button>

                </div>

                {error && (
                    <p className="text-red-500">Error: {error.message}</p>
                )}
            </div>
        </Card>
    );
};

export default SpeechRecognition;