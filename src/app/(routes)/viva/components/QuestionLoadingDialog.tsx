import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import AIAvatar from "./AIAvatar"
import { useEffect, useState } from "react"
import { CardContent } from "@/components/ui/card";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

interface Props {
    open: boolean;
    onStart: () => void;
    onClose: () => void;
    questionsLoading: boolean;
}

const loadingMessages = [
    "Analyzing your documents...",
    "Preparing personalized questions...",
    "Tailoring the assessment to your work...",
    "Finalizing your assessment...",
]

const QuestionLoadingDialog = ({ open, onStart, onClose, questionsLoading }: Props) => {
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0)
    const [isReady, setIsReady] = useState(false)

    useEffect(() => {
        if (!open) {
            setCurrentMessageIndex(0);
            setIsReady(false);
            return;
        }

        const messageInterval = setInterval(() => {
            setCurrentMessageIndex((prev) => {
                const nextIndex = (prev + 1) % loadingMessages.length;
                if (nextIndex === loadingMessages.length - 1) {
                    setIsReady(true);
                }
                return nextIndex;
            });
        }, 4000);

        return () => clearInterval(messageInterval);
    }, [open]);

    const handleStart = () => {
        onStart();
        onClose();
    };

    return (
        <Dialog open={open}>
            <DialogContent className="w-11/12 sm:max-w-md" removeCloseIcon={true} aria-describedby={undefined}>
                <VisuallyHidden.Root>
                    <DialogTitle>Assessment Rules</DialogTitle>
                </VisuallyHidden.Root>
                <div className="flex flex-col items-center space-y-6 py-4">
                    <AIAvatar expression="thinking" size={120} />
                    <div className="space-y-6 text-center">
                        <p className="text-center">Hello Kelvin, You are about to take the integrevise Assessment</p>

                        <CardContent className="flex flex-col items-center">
                            <h3 className="text-foreground text-center mb-2">Some rules</h3>
                            <ul className="custom-disc-size space-y-4 self-start text-left mx-auto">
                                <li>Maintain a Distraction-Free Environment</li>
                                <li>Use Approved Resources Only</li>
                                <li>Follow Identity Verification Procedures</li>
                                <li>Adhere to Technical Guidelines</li>
                            </ul>
                        </CardContent>

                        <Button
                            onClick={handleStart}
                            disabled={!isReady || questionsLoading}
                            className="w-full"
                        >
                            {questionsLoading ? loadingMessages[currentMessageIndex] : "Start Assessment"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default QuestionLoadingDialog 