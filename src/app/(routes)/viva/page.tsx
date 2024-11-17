"use client"

import { useAssessment } from '@/hooks/api/useAssessment'
import { useQuestions } from '@/hooks/api/useQuestions'
import useDeepgramSTT from '@/hooks/useDeepgramSTT'
import { useDeepgramTTS } from '@/hooks/useDeepgramTTS'
import useApiKey from '@/hooks/useDeepgramTempAPIKey'
import { useVivaSession } from '@/lib/store'
import { QuestionAnswer } from '@prisma/client'
import { useEffect, useState } from 'react'
import AISection from './components/AISection'
import SimpleStudentSection from './components/SimpleStudentSection'
import SuccessDialog from './components/SuccessDialog'
import ProcessingDialog from './components/ProcessingDialog'
import QuestionLoadingDialog from './components/QuestionLoadingDialog'
import { successToast } from '@/lib/toast'

//TODO: Add a loading state in the student section
//TODO: Implement the timer
//TODO: Handle transition to the next question when the answer is assessed

const Viva = () => {
    const { apiKey } = useApiKey();
    const [shouldStartListening, setShouldStartListening] = useState(false);

    const { isListening, transcript, startListening, stopListening, hasStopped, audioStream, error: sttError } = useDeepgramSTT(apiKey);

    const { isSpeaking, isLoading, convertToSpeech, error } = useDeepgramTTS(() => {
        setShouldStartListening(true);
    });

    const { sessionId: vivaSessionId } = useVivaSession();

    const { data: questionsData, isLoading: isQuestionsLoading } = useQuestions(vivaSessionId || "");
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState<QuestionAnswer | null>(null);

    const { mutate: assess, isPending: isAssessing } = useAssessment();

    const [isComplete, setIsComplete] = useState(false);

    const moveToNextQuestion = () => {
        if (!questionsData || !questionsData.length) return;

        const nextIndex = currentQuestionIndex + 1;
        if (nextIndex < questionsData.length) {
            setCurrentQuestionIndex(nextIndex);
            setCurrentQuestion(questionsData[nextIndex]);
        } else {
            setIsComplete(true);
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
                successToast(response.message);
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
                questionsLoading={isQuestionsLoading}
                convertToSpeech={convertToSpeech}
                error={error}
                question={currentQuestion?.friendlyQuestion}
                totalQuestions={questionsData?.length || 0}
                currentQuestionIndex={currentQuestionIndex + 1}
            />
            <SimpleStudentSection
                transcript={"My reason is very simple"}
                sendStudentMessage={sendStudentMessage}
            />
            <QuestionLoadingDialog open={isQuestionsLoading} />
            <ProcessingDialog open={isAssessing} />
            <SuccessDialog open={isComplete} />
        </main>
    )
}

export default Viva