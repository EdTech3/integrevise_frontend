interface TranscriptDisplayProps {
    transcript: string;
    isListening: boolean;
}

const TranscriptDisplay = ({ transcript, isListening }: TranscriptDisplayProps) => {
    return (
        <div className='flex-grow h-[300px] overflow-scroll'>
            {transcript && (
                <p className="text-center text-base sm:text-lg md:text-xl lg:text-2xl leading-tight w-full">
                    {transcript}
                </p>
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
    );
};

export default TranscriptDisplay;
