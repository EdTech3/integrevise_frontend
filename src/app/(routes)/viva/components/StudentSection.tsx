import Logo from '@/components/shared/Logo'
import StudentAvatar from './StudentAvatar'
import useDeepgramSTT from '@/hooks/useDeepgramSTT'
import { FaMicrophoneAlt } from "react-icons/fa";
import AudioVisualizer from '@/components/shared/Audiovisualizer';


const StudentSection = () => {
    const { transcript, isListening, startListening, stopListening, audioStream } = useDeepgramSTT();

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
                <AudioVisualizer
                    audioStream={audioStream}
                    isListening={isListening}
                    width={200}
                    height={50}
                    lineWidth={1}
                    strokeStyle="#fff"
                />
                <StudentAvatar />
            </div>
        </section>
    )
}

export default StudentSection