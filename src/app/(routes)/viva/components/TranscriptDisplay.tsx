import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Check, Pen } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface TranscriptDisplayProps {
    transcript: string;
    isListening: boolean;
    isEditing: boolean;
    setIsEditing: (isEditing: boolean) => void;
    onTranscriptEdit?: (newTranscript: string) => void;
    onEditStart?: () => void;
    onEditEnd?: () => void;
    activateIcon: boolean
}

const TranscriptDisplay = ({ transcript, isListening, isEditing, activateIcon, onEditStart, onEditEnd, onTranscriptEdit, setIsEditing }: TranscriptDisplayProps) => {
    const [editedTranscript, setEditedTranscript] = useState(transcript);
    const textareaRef = useRef<HTMLTextAreaElement>(null);


    useEffect(() => {
        if (!isEditing) {
            setEditedTranscript(transcript);
        }
    }, [transcript, isEditing]);

    const handleEditStart = () => {
        setIsEditing(!isEditing);
        onEditStart?.();
        // Focus the textarea when editing starts
        setTimeout(() => textareaRef.current?.focus(), 0);
    };

    const handleEditEnd = () => {
        setIsEditing(false);
        onEditEnd?.();
        onTranscriptEdit?.(editedTranscript);
    };


    return (
        <>
            {
                !isEditing &&
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div
                            onClick={handleEditStart}
                            className={` transition-opacity ${activateIcon ? "opacity-100" : "opacity-0 pointer-events-none"} min-w-10 min-h-10 rounded-full lg:shadow-sm self-end cursor-pointer flex justify-center items-center`}>
                            <Pen size={20} className="text-primary" />
                        </div>
                    </TooltipTrigger>
                    <TooltipContent className='bg-secondary-100 text-primary'>
                        <p >Edit text</p>
                    </TooltipContent>
                </Tooltip>
            }
            {
                isEditing &&
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div
                            onClick={handleEditEnd}
                            className={` transition-opacity min-w-10 min-h-10 rounded-full lg:shadow-sm self-end cursor-pointer flex justify-center items-center`}>
                            <Check size={20} className="text-primary" />
                        </div>
                    </TooltipTrigger>
                    <TooltipContent className='bg-secondary-100 text-primary'>
                        <p >Save Edit</p>
                    </TooltipContent>
                </Tooltip>
            }

            <div className='flex-grow h-[300px] overflow-scroll'>
                {transcript && !isEditing && (
                    <p className="text-center text-base sm:text-lg md:text-xl lg:text-2xl leading-tight w-full">
                        {editedTranscript}
                    </p>
                )}

                {transcript && isEditing && (
                    <textarea
                        ref={textareaRef}
                        className="w-full h-full text-center text-base sm:text-lg md:text-xl lg:text-2xl leading-tight resize-none focus:outline-none focus:ring-2 focus:ring-primary p-2 bg-transparent border-2 border-gray-500 rounded-md"
                        value={editedTranscript}
                        onChange={(e) => setEditedTranscript(e.target.value)}
                        onBlur={handleEditEnd}
                        autoFocus
                    />
                )}

                {!transcript && !isListening && (
                    <p className="text-center text-base sm:text-lg md:text-xl lg:text-2xl leading-tight">
                        Your transcribed text will appears here
                    </p>
                )}

                {!transcript && isListening && (
                    <p className="text-center text-base sm:text-lg md:text-xl lg:text-2xl leading-tight">
                        Listening...
                    </p>
                )}
            </div>
        </>
    );
};

export default TranscriptDisplay;
