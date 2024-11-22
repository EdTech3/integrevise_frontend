import Image from "next/image";
import Integrevise from "../../../public/logo.svg"
import IntegreviseLight from "../../../public/logo_light.svg"
import WelcomeIntegrevise from "../../../public/welcome_integrevise.svg"

interface LogoProps {
    width?: number;
    height?: number;
    className?: string
    type?: 'light' | 'dark' | 'welcome'
}

export default function Logo({ className, type = "dark", width = 180, height = 180 }: LogoProps) {

    const getLogo = () => {
        if (type === "light") {
            return IntegreviseLight
        }
        if (type === "welcome") {
            return WelcomeIntegrevise
        }
        return Integrevise
    }

    return (
        <Image src={getLogo()} alt="Integrevise Logo" className={className} width={width} height={height} />
    )
}