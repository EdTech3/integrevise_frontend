
import { useDeepgramTTS } from '@/hooks/useDeepgramTTS';
import CountdownTimer from '../../audio_test/components/CountdownTimer'
import AIAvatar from './AIAvatar'


const AISection = () => {
    const { convertToSpeech, error, isLoading } = useDeepgramTTS();

    const text = `  In your document, you mentioned the role of text-to-image diffusion in generating high-quality images from natural language descriptions. Could you elaborate on how this process works and how it contributes to the overall image quality? I'd love to hear your thoughts on the key factors that make it effective.`

    const handleSpeak = async () => {
        try {
            convertToSpeech(text).then(() => {
                console.log("Speech generated successfully");
            })
        } catch (err) {
            console.error('Error speaking:', err);
        }
    };


    return (
        <section className='space-y-20 px-4 h-1/2'>
            <div className='flex justify-between items-center'>
                <AIAvatar />
                <CountdownTimer time={120} />
            </div>

            <button onClick={handleSpeak} disabled={isLoading}>
                Speak
            </button>
            {error && <p>Error: {error}</p>}

            <p className='text-center text-base sm:text-lg md:text-xl lg:text-2xl'>
                {text}
            </p>
        </section>
    )
}

export default AISection