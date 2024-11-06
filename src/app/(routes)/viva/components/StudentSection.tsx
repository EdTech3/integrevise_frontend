import Logo from '@/components/shared/Logo'
import StudentAvatar from './StudentAvatar'

const StudentSection = () => {
    return (
        <section className="w-full bg-foreground py-12 px-4 h-1/2 space-y-20 rounded-tr-3xl rounded-tl-3xl flex flex-col justify-between">

            <p className="text-center text-base sm:text-lg md:text-xl lg:text-2xl text-background leading-tight">
                Text-to-image diffusion models generate images by transforming random noise into a coherent image based on a text
                description.
            </p>
            <div className='flex justify-between items-center'>
                <Logo type="light" width={140} height={140} />
                <div id='waveform_viva' />
                <StudentAvatar />
            </div>
        </section>
    )
}

export default StudentSection