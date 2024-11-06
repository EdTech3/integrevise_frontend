import Logo from '@/components/shared/Logo'
import React from 'react'
import { RiCheckboxCircleFill } from "react-icons/ri";
import SpeechRecognition from './components/SpeechRecognition';

const AudioTest = () => {
    return (
        <main className='flex flex-col'>
            <Logo />

            <div className='flex flex-row space-x-2 items-center'>
                <RiCheckboxCircleFill size={25} />
                <h6>Facial Recognition</h6>
            </div>

            <SpeechRecognition />
        </main>
    )
}

export default AudioTest