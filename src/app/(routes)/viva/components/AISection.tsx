import CountdownTimer from '../../audio_test/components/CountdownTimer'
import AIAvatar from './AIAvatar'

const AISection = () => {
    return (
        <section className='space-y-20 px-4 h-1/2'>
            <div className='flex justify-between items-center'>
                <AIAvatar />
                <CountdownTimer time={120} />
            </div>

            <p className='text-center text-base sm:text-lg md:text-xl lg:text-2xl'>
                In your document, you mentioned the role of text-to-image diffusion in generating high-quality images from natural language descriptions. Could you elaborate on how this process works and how it contributes to the overall image quality? {"I'd"} love to hear your thoughts on the key factors that make it effective.
            </p>
        </section>
    )
}

export default AISection