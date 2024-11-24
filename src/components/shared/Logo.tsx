import Image from "next/image";
import Integrevise from "../../../public/logo.svg"
import IntegreviseLight from "../../../public/logo_light.svg"
import WelcomeIntegrevise from "../../../public/welcome_integrevise.svg"
import SingInIntegrevise from "../../../public/signin_integrevise.svg"

interface LogoProps {
    width?: number;
    height?: number;
    className?: string
    type?: 'light' | 'dark' | 'welcome' | 'signin'
}

export default function Logo({ className, type = "dark", width = 180, height = 180 }: LogoProps) {

    const getLogo = () => {
        if (type === "light") {
            return IntegreviseLight
        }
        if (type === "welcome") {
            return WelcomeIntegrevise
        }
        if (type === "signin") {
            return SingInIntegrevise
        }
        return Integrevise
    }

    return (
        <Image src={getLogo()} alt="Integrevise Logo" className={className} width={width} height={height} priority/>
    )
}