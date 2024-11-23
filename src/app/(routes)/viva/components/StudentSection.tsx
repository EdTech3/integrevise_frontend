import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { errorToast } from '@/lib/toast';
import { Pen } from "lucide-react";
import { useEffect, useState } from 'react';
import TranscriptDisplay from './TranscriptDisplay';
import VivaControls from './VivaControls';

interface StudentSectionProps {
    transcript: string;
    isListening: boolean;
    audioStream: MediaStream | null;
    error: string | undefined;
    hasStopped: boolean;
    sendStudentMessage: (transcript: string) => void;
}

const StudentSection = ({ transcript, isListening, audioStream, error, hasStopped, sendStudentMessage }: StudentSectionProps) => {
    const [cameraOpen, setCameraOpen] = useState(false);
    // const activateIcon = Boolean(transcript && isListening && hasStopped);
    const activateIcon = true

    useEffect(() => {
        if (error) {
            errorToast(error);
        }
    }, [error])

    return (
        <TooltipProvider>
            <section className="w-full bg-secondary-100 text-foreground space-y-2 p-4 h-1/2 rounded-tr-3xl rounded-tl-3xl flex flex-col">

                <Tooltip>
                    <TooltipTrigger asChild>
                        <div className={` transition-opacity ${activateIcon ? "opacity-100" : "opacity-0 pointer-events-none"} min-w-10 min-h-10 rounded-full lg:shadow-sm self-end cursor-pointer flex justify-center items-center`}>
                            <Pen size={20} className="text-primary" />
                        </div>
                    </TooltipTrigger>
                    <TooltipContent className='bg-secondary-100 text-primary'>
                        <p >Edit text</p>
                    </TooltipContent>
                </Tooltip>

                <TranscriptDisplay
                    transcript={transcript}
                    isListening={isListening}
                />

                <VivaControls
                    isListening={isListening}
                    audioStream={audioStream}
                    transcript={transcript}
                    activateIcon={activateIcon}
                    cameraOpen={cameraOpen}
                    onCameraToggle={() => setCameraOpen(!cameraOpen)}
                    onSendMessage={sendStudentMessage}
                />
            </section>
        </TooltipProvider>
    )
}

export default StudentSection