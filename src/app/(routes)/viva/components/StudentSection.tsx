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
        <section className="w-full bg-secondary-100 text-foreground py-12 px-4 h-1/2 space-y-20 rounded-tr-3xl rounded-tl-3xl flex flex-col justify-between">
            <div>
                <div className={`w-16 h-16 rounded-full bg-secondary-200 flex items-center cursor-pointer hover:scale-95 justify-center ${isListening ? "animate-pulse" : ""}`}>
                    <FaMicrophoneAlt onClick={handleButtonClick} className='text-3xl ' />
                </div>

                {transcript &&
                    <p className="text-center text-base sm:text-lg md:text-xl lg:text-2xl leading-tight">
                        {transcript}
                    </p>
                }

                {!transcript && !isListening &&
                    <p className="text-center text-base sm:text-lg md:text-xl lg:text-2xl leading-tight">
                        Your transcribed text will appears here
                    </p>
                }

                {!transcript && isListening &&
                    <p className="text-center text-base sm:text-lg md:text-xl lg:text-2xl leading-tight">
                        Listening...
                    </p>
                }


            </div>
            <div className='flex justify-between items-center'>
                <Logo width={140} height={140} />
                <AudioVisualizer
                    audioStream={audioStream}
                    isListening={isListening}
                    containerClassName='w-[200px]'
                    height={50}
                    lineWidth={1}
                    strokeStyle="#203640"
                />
                <StudentAvatar />
            </div>
        </section>
    )
}

export default StudentSection