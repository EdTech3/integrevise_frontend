import CountdownTimer from '../../audio_test/components/CountdownTimer'
import AIAvatar from './AIAvatar'
import { useEffect, useState } from 'react';
import { errorToast } from '@/lib/toast';

interface AISectionProps {
    convertToSpeech: (text: string, onComplete?: () => void) => Promise<void>;
    error: string | null;
    isLoading: boolean;
    isSpeaking: boolean;
}

const AISection = ({ convertToSpeech, error, isLoading, isSpeaking }: AISectionProps) => {
    const [displayedText, setDisplayedText] = useState('');
    const fullText = `In your document, you mentioned the role of text-to-image diffusion in generating high-quality images from natural language descriptions. Could you elaborate on how this process works and how it contributes to the overall image quality? I'd love to hear your thoughts on the key factors that make it effective.`;

    const streamText = async () => {
        setDisplayedText('');
        for (let i = 0; i < fullText.length; i++) {
            await new Promise(resolve => setTimeout(resolve, 50));
            setDisplayedText(prev => prev + fullText[i]);
        }
    };

    const handleSpeak = async () => {
        if (isSpeaking) return;
        try {
            Promise.all([
                convertToSpeech(fullText),
                streamText()
            ]);
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
                    <AIAvatar />
                </figure>
                <CountdownTimer time={120} />
            </div>

            <p className='text-center text-base sm:text-lg md:text-xl lg:text-2xl'>
                {displayedText}
            </p>
        </section>
    )
}

export default AISection