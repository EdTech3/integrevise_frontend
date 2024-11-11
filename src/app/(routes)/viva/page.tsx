"use client"

import { useEffect, useState } from 'react'
import AISection from './components/AISection'
import StudentSection from './components/StudentSection'
import useDeepgramSTT from '@/hooks/useDeepgramSTT'
import { useDeepgramTTS } from '@/hooks/useDeepgramTTS'
import useApiKey from '@/hooks/useDeepgramTempAPIKey'

const Viva = () => {
    const { apiKey } = useApiKey();
    const [shouldStartListening, setShouldStartListening] = useState(false);

    const { isListening, transcript, startListening, stopListening, hasStopped, audioStream, error: sttError } = useDeepgramSTT(apiKey);

    const { isSpeaking, isLoading, convertToSpeech, error } = useDeepgramTTS(() => {
        setShouldStartListening(true);
    });

    useEffect(() => {
        if (shouldStartListening && apiKey && !isListening) {
            startListening();
            setShouldStartListening(false);
        }
    }, [shouldStartListening, apiKey, isListening, startListening]);


    useEffect(() => {
        console.log("Student stopped speaking", hasStopped);
    }, [hasStopped]);

    const sendStudentMessage = (transcript: string) => {
        console.log("Sending student message", transcript);
        stopListening();
    }

    return (
        <main className='pt-6 flex flex-col h-screen overflow-hidden'>
            <AISection
                isSpeaking={isSpeaking}
                isLoading={isLoading}
                convertToSpeech={convertToSpeech}
                error={error}
            />

            <StudentSection
                isListening={isListening}
                transcript={transcript}
                startListening={startListening}
                stopListening={stopListening}
                audioStream={audioStream}
                error={sttError?.message}
                hasStopped={hasStopped}
                sendStudentMessage={sendStudentMessage}
            />
        </main>
    )
}

export default Viva