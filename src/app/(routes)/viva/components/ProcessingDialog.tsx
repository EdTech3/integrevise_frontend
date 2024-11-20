import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import AIAvatar from "./AIAvatar"
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

interface Props {
    open: boolean;
}

const ProcessingDialog = ({ open }: Props) => {
    return (
        <Dialog open={open}>
            <DialogContent className="w-11/12 sm:max-w-md" removeCloseIcon={true} aria-describedby={undefined}>
                <VisuallyHidden.Root>
                    <DialogTitle>Processing Your Answer</DialogTitle>
                </VisuallyHidden.Root>
                <div className="flex flex-col items-center space-y-6 py-4 text-foreground">
                    <AIAvatar expression="thinking" size={120} />
                    <div className="space-y-2 text-center">
                        <h3 className="text-xl font-semibold">Processing Your Answer</h3>
                        <p className="text-muted-foreground">
                            Please wait while I analyse your response and prepare the next question...
                        </p>
                        <div className="flex justify-center gap-2 pt-2">
                            <span className="h-2 w-2 rounded-full bg-primary animate-ping" />
                            <span className="h-2 w-2 rounded-full bg-primary animate-ping [animation-delay:0.2s]" />
                            <span className="h-2 w-2 rounded-full bg-primary animate-ping [animation-delay:0.4s]" />
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default ProcessingDialog 