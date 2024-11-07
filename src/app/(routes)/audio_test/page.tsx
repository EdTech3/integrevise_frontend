"use client"
import Container from '@/components/shared/Container';
import Logo from '@/components/shared/Logo';
import PreAssessmentCheckTimeline from '@/components/shared/PreAssessmentCheckTimeline';
import SpeechRecognition from './components/SpeechRecognition';

//TODO: Add a recording indicator
//TODO: Add a functionality to either append to the current transcript or start a new one
//TODO: Add more controls to show user the current state of the audio stream



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