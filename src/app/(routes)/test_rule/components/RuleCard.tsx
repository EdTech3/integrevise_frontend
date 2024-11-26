import Logo from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

export default function RuleCard() {
    return (
        <Card className="flex flex-col items-center w-full max-w-md space-y-4">
            <CardHeader className="flex flex-col items-center">
                <Logo />
                <p className="text-center">Hello Kyle, You are about to take the integrevise Assessment</p>
            </CardHeader>


            <CardContent className="flex flex-col items-center">
                <h3 className="text-foreground text-center mb-2">Some rules</h3>
                <ul className="custom-disc-size space-y-4 ">
                    <li>Maintain a Distraction-Free Environment</li>
                    <li>Use Approved Resources Only</li>
                    <li>Follow Identity Verification Procedures</li>
                    <li>Adhere to Technical Guidelines</li>
                </ul>
            </CardContent>

            <CardFooter>
                <Button>Continue to Assessment</Button>
            </CardFooter>

        </Card>
    )
}