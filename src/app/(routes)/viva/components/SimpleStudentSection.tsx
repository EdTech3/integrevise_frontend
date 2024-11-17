import { Button } from "@/components/ui/button";

interface SimpleStudentSectionProps {
    transcript: string;
    sendStudentMessage: (transcript: string) => void;
}

const SimpleStudentSection = ({ transcript, sendStudentMessage }: SimpleStudentSectionProps) => {
    return (
        <section className="w-full bg-secondary-100 text-foreground p-4 h-1/2 rounded-tr-3xl rounded-tl-3xl flex flex-col">
            <div className='flex-grow h-[300px] overflow-scroll'>
                <p className="text-center text-base sm:text-lg md:text-xl lg:text-2xl leading-tight w-full">
                    {transcript || "Your transcribed text will appear here"}
                </p>
            </div>

            <div className='flex justify-center'>
                <Button
                    onClick={() => sendStudentMessage(transcript)}
                    className="text-background hover:text-primary/80 transition-colors duration-500 px-4 py-2"
                    aria-label="Send message"
                >
                    Send Message
                </Button>
            </div>
        </section>
    )
}

export default SimpleStudentSection 