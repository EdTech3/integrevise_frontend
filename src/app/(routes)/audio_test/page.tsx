import Logo from '@/components/shared/Logo'
import React from 'react'
import { RiCheckboxCircleFill } from "react-icons/ri";
import SpeechRecognition from './components/SpeechRecognition';

const AudioTest = () => {
    return (
        <main>
            <Logo />

            <div className='flex flex-row space-x-2 items-center'>
                <RiCheckboxCircleFill size={25} />
                <h6>Facial Recognition</h6>
            </div>
            {/* 
            <div>
                <p>My name is Chloe Decker and I am testing the speech-to-text feature on Integrevise on a Monday</p>

                <div>

                    <small>Say Something</small>
                </div>
            </div> */}


            <SpeechRecognition />

        </main>
    )
}

export default AudioTest