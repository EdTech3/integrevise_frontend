"use client"

import { useAssessment } from '@/hooks/api/useAssessment'
import { useQuestions } from '@/hooks/api/useQuestions'
import useDeepgramSTT from '@/hooks/useDeepgramSTT'
import { useDeepgramTTS } from '@/hooks/useDeepgramTTS'
import useApiKey from '@/hooks/useDeepgramTempAPIKey'
import { useQuestionTimer } from '@/hooks/useQuestionTimer'
import { useVivaSession } from '@/lib/store'
import { successToast } from '@/lib/toast'
import { QuestionAnswer } from '@prisma/client'
import { useCallback, useEffect, useState } from 'react'
import AISection from './components/AISection'
import ProcessingDialog from './components/ProcessingDialog'
import QuestionLoadingDialog from './components/QuestionLoadingDialog'
import StudentSection from './components/StudentSection'
import SuccessDialog from './components/SuccessDialog'


const Viva = () => {
    const { apiKey } = useApiKey();
    const [shouldStartListening, setShouldStartListening] = useState(false);
    const [showLoadingDialog, setShowLoadingDialog] = useState(true);
    const [hasInitialInteraction, setHasInitialInteraction] = useState(false);

    const {
        isListening,
        transcript,
        pauseListening,
        resumeListening,
        updateTranscript,
        startListening,
        stopListening,
        hasStopped,
        audioStream,
        error: sttError
    } = useDeepgramSTT(apiKey);

    const {
        isSpeaking,
        isLoading: isTTSLoading,
        convertToSpeech,
        error: ttsError
    } = useDeepgramTTS(() => {
        setShouldStartListening(true);
    });

    const { sessionId: vivaSessionId } = useVivaSession();

    const { data: questionsData, isLoading: isQuestionsLoading } = useQuestions(vivaSessionId || "");
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState<QuestionAnswer | null>(null);

    const { mutate: assess, isPending: isAssessing } = useAssessment();

    const [isComplete, setIsComplete] = useState(false);
    const [questionDisplayTime, setQuestionDisplayTime] = useState<Date | null>(null);
    const timer = useQuestionTimer();

    const [displayedText, setDisplayedText] = useState('');

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
        timer.stopTimer();
        setShouldStartListening(false);
        stopListening();
        assess({
            vivaSessionId: vivaSessionId || "",
            question: {
                id: currentQuestion?.id || "",
                text: currentQuestion?.question || ""
            },
            answer: transcript,
            timing: {
                displayedAt: questionDisplayTime?.toISOString() || new Date().toISOString(),
                answeredAt: new Date().toISOString()
            }
        }, {
            onSuccess: (response) => {
                successToast(response.message);
                setQuestionDisplayTime(null);
                moveToNextQuestion();
            },
        });
    }

    const handleSpeak = useCallback(async () => {
        if (!currentQuestion?.friendlyQuestion) return;

        try {
            const result = await convertToSpeech(currentQuestion.friendlyQuestion);
            if (result) {
                const { audio, streamDelay } = result;
                audio.play();
                setDisplayedText('');
                for (let i = 0; i < currentQuestion.friendlyQuestion.length; i++) {
                    await new Promise(resolve => setTimeout(resolve, streamDelay));
                    setDisplayedText(prev => prev + currentQuestion.friendlyQuestion[i]);
                }
            }
        } catch (err) {
            console.error('Error speaking:', err);
        }
    }, [currentQuestion?.friendlyQuestion]);



    const handleFirstSpeak = useCallback(() => {
        setHasInitialInteraction(true);
        handleSpeak();
    }, [handleSpeak]);


    // Side Effects
    useEffect(() => {
        if (hasInitialInteraction && currentQuestion?.friendlyQuestion && currentQuestionIndex > 0) {
            handleSpeak();
        }
    }, [currentQuestionIndex, currentQuestion?.friendlyQuestion, hasInitialInteraction, handleSpeak]);

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

    useEffect(() => {
        if (currentQuestion?.id) {
            timer.resetTimer();
            timer.startTimer();
            setQuestionDisplayTime(new Date());
        }
    }, [currentQuestion?.id]);

    if (showLoadingDialog) return (
        <main className='pt-6 flex flex-col h-screen overflow-hidden'>
            <QuestionLoadingDialog
                open={showLoadingDialog}
                onStart={handleFirstSpeak}
                onClose={() => setShowLoadingDialog(false)}
                questionsLoading={isQuestionsLoading}
            />
        </main>
    )

    return (
        <main className='pt-6 flex flex-col h-screen overflow-hidden'>
            <AISection
                isSpeaking={isSpeaking}
                isLoading={isTTSLoading}
                questionsLoading={isQuestionsLoading}
                error={ttsError}
                question={currentQuestion?.friendlyQuestion}
                totalQuestions={questionsData?.length || 0}
                currentQuestionIndex={currentQuestionIndex + 1}
                time={timer.time}
                displayedText={displayedText}
            />

            <StudentSection
                transcript={transcript}
                isListening={isListening}
                audioStream={audioStream}
                error={sttError?.message}
                hasStopped={hasStopped}
                sendStudentMessage={sendStudentMessage}
                updateTranscript={updateTranscript}
                pauseListening={pauseListening}
                resumeListening={resumeListening}
            />
            <ProcessingDialog open={isAssessing} />
            <SuccessDialog open={isComplete} />
        </main>
    )
}

export default Viva