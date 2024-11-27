import AudioVisualizer from '@/components/shared/Audiovisualizer';
import Logo from '@/components/shared/Logo';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { IoSend } from "react-icons/io5";
import { FaCircle } from "react-icons/fa";
import StudentAvatar from './StudentAvatar';

interface VivaControlsProps {
    isListening: boolean;
    audioStream: MediaStream | null;
    transcript: string;
    activateIcon: boolean;
    cameraOpen: boolean;
    onCameraToggle: () => void;
    onSendMessage: (transcript: string) => void;
}

const VivaControls = ({
    isListening,
    audioStream,
    transcript,
    activateIcon,
    cameraOpen,
    onCameraToggle,
    onSendMessage
}: VivaControlsProps) => {
    return (
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
                        <IoSend
                            onClick={() => onSendMessage(transcript)}
                            className={`cursor-pointer transition-colors duration-500
                                ${activateIcon ? 'animate-in slide-in-from-left duration-300 text-primary' : 'text-gray-300'}`}
                            aria-label="Send message"
                            size={24} />
                    </TooltipTrigger>
                    <TooltipContent className='bg-secondary-100 text-primary'>
                        <p>Send message</p>
                    </TooltipContent>
                </Tooltip>
            </div>

            <figure onClick={onCameraToggle}>
                <StudentAvatar useCamera={cameraOpen} />
            </figure>
        </div>
    );
};

export default VivaControls;
