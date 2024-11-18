import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import Confetti from 'react-confetti'
import { useEffect, useState } from "react"
import { DialogDescription } from "@radix-ui/react-dialog"

interface Props {
    open: boolean;
}

const SuccessDialog = ({ open }: Props) => {
    const router = useRouter()
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

    useEffect(() => {
        // Get window dimensions for confetti
        setDimensions({
            width: window.innerWidth,
            height: window.innerHeight
        })

        const handleResize = () => {
            setDimensions({
                width: window.innerWidth,
                height: window.innerHeight
            })
        }

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return (
        <Dialog open={open}>
            {open && (
                <Confetti
                    width={dimensions.width}
                    height={dimensions.height}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        zIndex: 100,
                        pointerEvents: 'none'
                    }}
                />
            )}
            <DialogContent className="sm:max-w-md" removeCloseIcon={true} aria-describedby={undefined}>
                <DialogHeader>
                    <DialogTitle className="text-center text-2xl">Congratulations! 🎉</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col items-center space-y-4 py-4">
                    <p className="text-center text-lg">
                        You have successfully completed all questions in this assessment! Your results will be sent to your lecturer.
                    </p>
                    <Button
                        onClick={() => router.push("/evaluation")}
                        className="w-full"
                    >
                        Return to Editor
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default SuccessDialog 