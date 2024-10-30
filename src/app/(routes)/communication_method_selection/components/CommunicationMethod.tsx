"use client"
import React from 'react';
import { CommunicationMethodTypes } from '../type';

interface Props {
    icon: React.ReactNode;
    text: string;
    value: CommunicationMethodTypes
    handleClick: (option: CommunicationMethodTypes) => void

}

const CommunicationMethod = ({ icon, text, value, handleClick }: Props) => {
    return (
        <div
            onClick={() => handleClick(value)}
            className='bg-foreground text-background rounded-3xl px-10 py-2 lg:py-8 lg:space-y-2 space-x-4 lg:space-x-0 w-full lg:max-w-40 flex flex-row justify-center lg:justify-normal lg:flex-col items-center transition-all duration-500 hover:scale-110 hover:bg-secondary-100 hover:text-foreground cursor-pointer'>
            {icon}
            <h5 className='font-medium'>{text}</h5>
        </div>
    );
};

export default CommunicationMethod;