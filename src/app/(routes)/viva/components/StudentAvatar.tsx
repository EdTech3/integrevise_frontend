import React from 'react';
import Image from 'next/image';
import Webcam from 'react-webcam';

interface Props {
    useCamera?: boolean;
}

const StudentAvatar = ({ useCamera = true }: Props) => {
    if (!useCamera) {
        return (
            <Image
                src="https://avatar.iran.liara.run/public/20"
                width={100}
                height={100}
                className='rounded-full'
                alt='Student avatar'
            />
        );
    }

    return (
        <div className="relative w-[100px] h-[100px] rounded-full overflow-hidden overlay">
            <Webcam
                audio={false}
                mirrored
                className="absolute inset-0 w-full h-full object-cover"
                videoConstraints={{
                    width: 100,
                    height: 100,
                    facingMode: "user"
                }}
            />
        </div>
    );
};

export default StudentAvatar;