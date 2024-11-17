import { Dialog, DialogContent } from "@/components/ui/dialog"
import AIAvatar from "./AIAvatar"
import { useEffect, useState } from "react"

interface Props {
    open: boolean;
}

const loadingMessages = [
    "Analyzing your documents...",
    "Preparing personalized questions...",
    "Tailoring the assessment to your work...",
    "Almost ready to begin...",
]


const QuestionLoadingDialog = ({ open }: Props) => {
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0)

    useEffect(() => {
        if (!open) return

        const messageInterval = setInterval(() => {
            setCurrentMessageIndex((prev) => (prev + 1) % loadingMessages.length)
        }, 4000)

        return () => {
            clearInterval(messageInterval)
        }
    }, [open])

    return (
        <Dialog open={open}>
            <DialogContent className="w-11/12 sm:max-w-md" removeCloseIcon={true}>
                <div className="flex flex-col items-center space-y-6 py-4">
                    <AIAvatar expression="thinking" size={120} />
                    <div className="space-y-6 text-center">
                        <div className="space-y-2">
                            <h2 className="text-lg font-medium">Preparing Your Assessment</h2>
                            <p className="text-muted-foreground min-h-[1.5rem] transition-all duration-500">
                                {loadingMessages[currentMessageIndex]}
                            </p>
                        </div>

                        <div className="flex justify-center gap-2 pt-2">
                            <span className="h-2 w-2 rounded-full bg-primary animate-bounce" />
                            <span className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:0.2s]" />
                            <span className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:0.4s]" />
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default QuestionLoadingDialog 