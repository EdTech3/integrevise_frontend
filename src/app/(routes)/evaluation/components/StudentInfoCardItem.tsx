import React from 'react'

interface Props {
    title: string;
    value: string;
}

const StudentInfoCardItem = ({ title, value }: Props) => {
    return (
        <div className='text-background '>
            <h3 className='text-xl font-bold'>{title}</h3>
            <p className='text-sm font-light'>{value}</p>
        </div>
    )
}

export default StudentInfoCardItem