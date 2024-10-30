import Image from "next/image";
import Integrevise from "../../../public/logo.svg"

interface LogoProps {
    width?: number;
    height?: number;
    className?: string
}

export default function Logo({ className, width = 180, height = 180 }: LogoProps) {
    return (
        <Image src={Integrevise} alt="Integrevise Logo" className={className} width={width} height={height} />
    )
}