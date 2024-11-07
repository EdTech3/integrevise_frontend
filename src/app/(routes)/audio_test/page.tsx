"use client"
import Container from '@/components/shared/Container';
import Logo from '@/components/shared/Logo';
import PreAssessmentCheckTimeline from '@/components/shared/PreAssessmentCheckTimeline';
import SpeechRecognition from './components/SpeechRecognition';


const AudioTest = () => {
    return (
        <Container>
            <main className='flex flex-col pt-7'>
                <Logo className='sm:mb-5 mb-10' />

                <PreAssessmentCheckTimeline selectedId="microphone-test" />

                <SpeechRecognition />
            </main>
        </Container>
    )
}

export default AudioTest