import Container from "@/components/shared/Container";
import RuleCard from "./components/RuleCard";

export default function TestRule() {
    return (
        <Container>
            <main className="flex flex-col justify-center items-center min-h-screen">
                <RuleCard />
            </main>
        </Container>
    )
}