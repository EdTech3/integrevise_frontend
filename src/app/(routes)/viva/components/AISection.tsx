import CountdownTimer from '../../audio_test/components/CountdownTimer'
import AIAvatar from './AIAvatar'
import { useEffect, useState, useCallback } from 'react';
import { errorToast } from '@/lib/toast';
import { AIAvatarExpression } from '../type';

interface AISectionProps {
    convertToSpeech: (text: string) => Promise<{ audio: HTMLAudioElement, streamDelay: number } | null>;
    error: string | null;
    isLoading: boolean;
    isSpeaking: boolean;
    question: string | null | undefined;
    questionsLoading: boolean;
}

const AISection = ({ convertToSpeech, error, isLoading, isSpeaking, question, questionsLoading }: AISectionProps) => {
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
        <section className='space-y-20 px-4 h-1/2'>
            <div className='flex justify-between items-center'>
                <AIAvatar expression={expression} />
                <CountdownTimer time={120} />
            </div>
            {isLoading || questionsLoading && <p className='text-center text-base sm:text-lg md:text-xl lg:text-2xl'>Loading Your Question...</p>}
            {!isLoading && !questionsLoading &&
                <p className='text-center text-base sm:text-lg md:text-xl lg:text-2xl'>
                    {displayedText}
                </p>
            }
        </section>
    )
}

export default AISection