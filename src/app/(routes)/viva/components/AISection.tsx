import QuestionTimer from '@/components/shared/QuestionTimer';
import { errorToast } from '@/lib/toast';
import { useCallback, useEffect, useState } from 'react';
import { AIAvatarExpression } from '../type';
import AIAvatar from './AIAvatar';

interface Props {
    convertToSpeech: (text: string) => Promise<{ audio: HTMLAudioElement, streamDelay: number } | null>;
    error: string | null;
    isLoading: boolean;
    isSpeaking: boolean;
    question: string | null | undefined;
    questionsLoading: boolean;
    totalQuestions: number;
    currentQuestionIndex: number;
    time: string
}

const AISection = ({ convertToSpeech, error, isLoading, isSpeaking, question, questionsLoading, totalQuestions, currentQuestionIndex, time }: Props) => {
    const [displayedText, setDisplayedText] = useState('');
    const [expression, setExpression] = useState<AIAvatarExpression>('neutral');


    useEffect(() => {
        if (isSpeaking) {
            setExpression('speaking');
        } else if (isLoading) {
            setExpression('thinking');
        } else {
            setExpression('engaged');
        }
    }, [isSpeaking, isLoading]);

    const handleSpeak = useCallback(async () => {
        if (isLoading) return;
        if (questionsLoading) return;
        if (!question) return;

        setDisplayedText('');
        const CHAR_DELAY = 50;
        for (let i = 0; i < question.length; i++) {
            await new Promise(resolve => setTimeout(resolve, CHAR_DELAY));
            setDisplayedText(prev => prev + question[i]);
        }
    }, [isLoading, questionsLoading, question]);

    useEffect(() => {
        if (error) {
            errorToast(error);
        }
    }, [error])

    useEffect(() => {
        handleSpeak();
    }, [handleSpeak]);

    return (
        <section className='space-y-10 px-4 h-1/2'>
            <div className='flex justify-between items-center'>
                <AIAvatar expression={expression} />
                <QuestionTimer time={time} />
            </div>
            <div className='space-y-4'>
                {!questionsLoading &&
                    <div className='text-center'>
                        <span className='text-secondary-200'>{currentQuestionIndex}</span> of <span className='text-foreground'>{totalQuestions}</span>
                    </div>
                }
                {isLoading || questionsLoading && <p className='text-center text-base sm:text-lg md:text-xl lg:text-2xl'>Loading Your Question...</p>}
                {!isLoading && !questionsLoading &&
                    <p className='text-center text-base sm:text-lg md:text-xl lg:text-2xl'>
                        {displayedText}
                    </p>
                }
            </div>
        </section>
    )
}

export default AISection