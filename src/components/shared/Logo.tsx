import Image from "next/image";
import Integrevise from "../../../public/logo.svg"
import IntegreviseLight from "../../../public/logo_light.svg"

interface LogoProps {
    width?: number;
    height?: number;
    className?: string
    type?: 'light' | 'dark'
}

export default function Logo({ className, type = "dark", width = 180, height = 180 }: LogoProps) {

    const getLogo = () => {
        if (type === "light") {
            return IntegreviseLight
        }
        return Integrevise
    }

    return (
        <Image src={getLogo()} alt="Integrevise Logo" className={className} width={width} height={height} />
    )
}