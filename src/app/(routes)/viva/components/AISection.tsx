import QuestionTimer from '@/components/shared/QuestionTimer';
import { errorToast } from '@/lib/toast';
import { useEffect, useState } from 'react';
import { AIAvatarExpression } from '../type';
import AIAvatar from './AIAvatar';

interface Props {
    error: string | null;
    isLoading: boolean;
    isSpeaking: boolean;
    question: string | null | undefined;
    questionsLoading: boolean;
    totalQuestions: number;
    currentQuestionIndex: number;
    time: string;
    displayedText: string;
}

const AISection = ({
    error,
    isLoading,
    isSpeaking,
    questionsLoading,
    totalQuestions,
    currentQuestionIndex,
    time,
    displayedText
}: Props) => {
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

    useEffect(() => {
        if (error) {
            errorToast(error);
        }
    }, [error])

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