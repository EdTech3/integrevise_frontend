import Logo from '@/components/shared/Logo'
import StudentAvatar from './StudentAvatar'
import { WaveSurferOptions } from 'wavesurfer.js'
import useDeepgramSTT from '@/hooks/useDeepgramSTT'
import { FaMicrophoneAlt } from "react-icons/fa";

const waveSurferOption: WaveSurferOptions = {
    container: "#waveform_viva",
    waveColor: 'hsl(0, 0%, 99%)',
    cursorWidth: 0,
    barGap: 2,
    height: "auto"
}


const StudentSection = () => {
    const { transcript, isListening, startListening, stopListening } = useDeepgramSTT(waveSurferOption);

    const handleButtonClick = () => {
        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    };

    return (
        <section className="w-full bg-foreground py-12 px-4 min-h-1/2 space-y-20 rounded-tr-3xl rounded-tl-3xl flex flex-col justify-between">
            <div>
                <div className={`w-16 h-16 rounded-full bg-background flex items-center cursor-pointer hover:scale-95 justify-center ${isListening ? "animate-pulse" : ""}`}>
                    <FaMicrophoneAlt onClick={handleButtonClick} className='text-3xl ' />
                </div>

                {transcript ?
                    <p className="text-center text-base sm:text-lg md:text-xl lg:text-2xl text-background leading-tight">
                        {transcript}
                    </p> :
                    <p className="text-center text-base sm:text-lg md:text-xl lg:text-2xl text-background leading-tight">
                        Your transcribed text will appear here
                    </p>
                }
            </div>
            <div className='flex justify-between items-center'>
                <Logo type="light" width={140} height={140} />
                <div id='waveform_viva' className='w-[120px] h-[30px] border-none self-center' />
                <StudentAvatar />
            </div>
        </section>
    )
}

export default StudentSection