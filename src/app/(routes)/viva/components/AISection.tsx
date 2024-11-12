import CountdownTimer from '../../audio_test/components/CountdownTimer'
import AIAvatar from './AIAvatar'
import { useEffect, useState } from 'react';
import { errorToast } from '@/lib/toast';
import { AIAvatarExpression } from '../type';

interface AISectionProps {
    convertToSpeech: (text: string) => Promise<{ audio: HTMLAudioElement, streamDelay: number } | null>;
    error: string | null;
    isLoading: boolean;
    isSpeaking: boolean;
}

const AISection = ({ convertToSpeech, error, isLoading, isSpeaking }: AISectionProps) => {
    const [displayedText, setDisplayedText] = useState('');
    const [expression, setExpression] = useState<AIAvatarExpression>('neutral');
    const fullText = `In your document, you mentioned the role of text-to-image diffusion in generating high-quality images from natural language descriptions. Could you elaborate on how this process works and how it contributes to the overall image quality? I'd love to hear your thoughts on the key factors that make it effective.`;

    useEffect(() => {
        if (isSpeaking) {
            setExpression('speaking');
        } else if (isLoading) {
            setExpression('thinking');
        } else {
            setExpression('engaged');
        }
    }, [isSpeaking, isLoading]);

    const handleSpeak = async () => {
        if (isSpeaking) return;
        if (isLoading) return;
        try {
            const result = await convertToSpeech(fullText);
            if (result) {
                const { audio, streamDelay } = result;

                // Start playing audio
                audio.play();

                // Start streaming text with calculated delay
                setDisplayedText('');
                for (let i = 0; i < fullText.length; i++) {
                    await new Promise(resolve => setTimeout(resolve, streamDelay));
                    setDisplayedText(prev => prev + fullText[i]);
                }
            }
        } catch (err) {
            console.error('Error speaking:', err);
        }
    };

    useEffect(() => {
        if (error) {
            errorToast(error);
        }
    }, [error])

    return (
        <section className='space-y-20 px-4 h-1/2'>
            <div className='flex justify-between items-center'>
                <figure onClick={handleSpeak}>
                    <AIAvatar expression={expression} />
                </figure>
                <CountdownTimer time={120} />
            </div>
            {isLoading && <p className='text-center text-base sm:text-lg md:text-xl lg:text-2xl'>Loading Your Question...</p>}
            {!isLoading &&
                <p className='text-center text-base sm:text-lg md:text-xl lg:text-2xl'>
                    {displayedText}
                </p>
            }
        </section>
    )
}

export default AISection