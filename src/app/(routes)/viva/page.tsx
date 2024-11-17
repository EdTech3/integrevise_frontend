"use client"

import { useEffect, useState } from 'react'
import AISection from './components/AISection'
import StudentSection from './components/StudentSection'
import useDeepgramSTT from '@/hooks/useDeepgramSTT'
import { useDeepgramTTS } from '@/hooks/useDeepgramTTS'
import useApiKey from '@/hooks/useDeepgramTempAPIKey'
import { useVivaSession } from '@/lib/store'
import { useQuestions } from '@/hooks/api/useQuestions'
import SimpleStudentSection from './components/SimpleStudentSection'
import { useAssessment } from '@/hooks/api/useAssessment'
import { QuestionAnswer } from '@prisma/client'

const Viva = () => {
    const { apiKey } = useApiKey();
    const [shouldStartListening, setShouldStartListening] = useState(false);

    const { isListening, transcript, startListening, stopListening, hasStopped, audioStream, error: sttError } = useDeepgramSTT(apiKey);

    const { isSpeaking, isLoading, convertToSpeech, error } = useDeepgramTTS(() => {
        setShouldStartListening(true);
    });

    const { sessionId: vivaSessionId } = useVivaSession();

    const { data: questionsData, isLoading: questionsLoading } = useQuestions(vivaSessionId || "");
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState<QuestionAnswer | null>(null);

    const { mutate: assess, isPending: isAssessing } = useAssessment();

    const moveToNextQuestion = () => {
        if (!questionsData || !questionsData.length) return;

        const nextIndex = currentQuestionIndex + 1;
        if (nextIndex < questionsData.length) {
            setCurrentQuestionIndex(nextIndex);
            setCurrentQuestion(questionsData[nextIndex]);
        }
    };

    const sendStudentMessage = async (transcript: string) => {
        // stopListening();

        assess({
            vivaSessionId: vivaSessionId || "",
            question: {
                id: currentQuestion?.id || "",
                text: currentQuestion?.question || ""
            },
            answer: transcript
        }, {
            onSuccess: (response) => {
                console.log('Assessment response:', response);
                moveToNextQuestion();
            },
        });
    }


    // Side Effects
    useEffect(() => {
        console.log("Questions:", questionsData);
    }, [questionsData]);

    useEffect(() => {
        if (questionsData && questionsData.length > 0) {
            setCurrentQuestion(questionsData[currentQuestionIndex]);
        }
    }, [questionsData, currentQuestionIndex]);


    useEffect(() => {
        if (shouldStartListening && apiKey && !isListening) {
            startListening();
            setShouldStartListening(false);
        }
    }, [shouldStartListening, apiKey, isListening, startListening]);


    useEffect(() => {
        console.log("Student stopped speaking", hasStopped);
    }, [hasStopped]);



    return (
        <main className='pt-6 flex flex-col h-screen overflow-hidden'>
            <AISection
                isSpeaking={isSpeaking}
                isLoading={isLoading}
                questionsLoading={questionsLoading}
                convertToSpeech={convertToSpeech}
                error={error}
                question={currentQuestion?.friendlyQuestion}
            />
            {/* 
            <StudentSection
                isListening={isListening}
                transcript={transcript}
                startListening={startListening}
                stopListening={stopListening}
                audioStream={audioStream}
                error={sttError?.message}
                hasStopped={hasStopped}
                sendStudentMessage={sendStudentMessage}
            /> */}

            <SimpleStudentSection
                transcript={"My reason is very simple"}
                sendStudentMessage={sendStudentMessage}
            />
        </main>
    )
}

export default Viva