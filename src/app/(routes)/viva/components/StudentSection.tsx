import { TooltipProvider } from "@/components/ui/tooltip";
import { errorToast } from '@/lib/toast';
import { useEffect, useState } from 'react';
import TranscriptDisplay from './TranscriptDisplay';
import VivaControls from './VivaControls';

interface StudentSectionProps {
    transcript: string;
    isListening: boolean;
    audioStream: MediaStream | null;
    error: string | undefined;
    hasStopped: boolean;
    isSpeaking: boolean;
    sendStudentMessage: (transcript: string) => void;
    updateTranscript: (newTranscript: string) => void
    pauseListening: () => void
    resumeListening: () => void
}

const StudentSection = ({ transcript, isListening, audioStream, error, hasStopped, isSpeaking, sendStudentMessage, updateTranscript, pauseListening, resumeListening }: StudentSectionProps) => {
    const [cameraOpen, setCameraOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const activateIcon = Boolean(transcript && isListening && hasStopped && !isEditing);


    useEffect(() => {
        if (error) {
            errorToast(error);
        }
    }, [error])

    return (
        <TooltipProvider>
            <section className="w-full bg-secondary-100 text-foreground space-y-2 p-4 h-1/2 rounded-tr-3xl rounded-tl-3xl flex flex-col">


                <TranscriptDisplay
                    transcript={transcript}
                    isListening={isListening}
                    isEditing={isEditing}
                    setIsEditing={setIsEditing}
                    onTranscriptEdit={updateTranscript}
                    onEditStart={pauseListening}
                    onEditEnd={resumeListening}
                    isSpeaking={isSpeaking}
                    activateIcon={activateIcon}
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