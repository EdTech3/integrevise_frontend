import Logo from '@/components/shared/Logo'
import React from 'react'
import { RiCheckboxCircleFill } from "react-icons/ri";
import SpeechRecognition from './components/SpeechRecognition';
import Container from '@/components/shared/Container';

//TODO: Add a recording indicator
//TODO: Add a functionality to either append to the current transcript or start a new one
//TODO: Add more controls to show user the current state of the audio stream



const AudioTest = () => {
    return (
        <Container>
            <main className='flex flex-col'>
                <Logo />

                <div className='flex flex-row space-x-2 items-center'>
                    <RiCheckboxCircleFill size={25} />
                    <h6>Facial Recognition</h6>
                </div>

                <SpeechRecognition />
            </main>
        </Container>
    )
}

export default AudioTest