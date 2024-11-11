import AudioVisualizer from '@/components/shared/Audiovisualizer';
import Logo from '@/components/shared/Logo';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { errorToast } from '@/lib/toast';
import { useEffect } from 'react';
import { IoSend } from "react-icons/io5";
import { FaCircle } from "react-icons/fa";
import StudentAvatar from './StudentAvatar';

interface StudentSectionProps {
    transcript: string;
    isListening: boolean;
    startListening: () => void;
    stopListening: () => void;
    audioStream: MediaStream | null;
    error: string | undefined;
    hasStopped: boolean;
    sendStudentMessage: (transcript: string) => void;
}

const StudentSection = ({ transcript, isListening, startListening, stopListening, audioStream, error, hasStopped, sendStudentMessage }: StudentSectionProps) => {
    const handleButtonClick = () => {
        if (isListening) {
            stopListening();
        } else {
            startListening();
            console.log("Started Listening")
        }
    };

    useEffect(() => {
        if (error) {
            errorToast(error);
        }
    }, [error])

    return (
        <TooltipProvider>
            <section className="w-full bg-secondary-100 text-foreground space-y-2 p-4 h-1/2 rounded-tr-3xl rounded-tl-3xl flex flex-col">


                <div className='flex-grow h-[300px] overflow-scroll'>
                    {transcript &&
                        <p className="text-center text-base sm:text-lg md:text-xl lg:text-2xl leading-tight  w-full">
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

                    <div className="shadow-md px-4 rounded-3xl flex items-center gap-2 transition-[width] duration-500 lg:w-[350px]">
                        <FaCircle className={`rounded-full text-red-500 transition-opacity duration-1000  ${isListening ? "animate-pulse" : "hidden"}`} />
                        <AudioVisualizer
                            audioStream={audioStream}
                            isListening={isListening}
                            containerClassName='w-full'
                            height={50}
                            lineWidth={1}
                            strokeStyle="#203640"
                        />

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button
                                    onClick={() => {
                                        sendStudentMessage(transcript);
                                    }}
                                    className={`text-primary hover:text-primary/80 transition-colors duration-500
                                        ${hasStopped ? 'animate-in slide-in-from-left duration-300' : 'hidden'}`}
                                    aria-label="Send message"
                                >
                                    <IoSend size={24} />
                                </button>
                            </TooltipTrigger>
                            <TooltipContent onClick={handleButtonClick} >
                                <p>Send message</p>
                            </TooltipContent>
                        </Tooltip>

                    </div>

                    <StudentAvatar />
                </div>
            </section>
        </TooltipProvider>
    )
}

export default StudentSection