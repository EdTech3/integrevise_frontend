import React from 'react'

interface Props {
    time: number
}

const CountdownTimer = ({ time }: Props) => {
    const minutes = Math.floor(time / 60)
    const seconds = time % 60

    return (
        <div className='bg-secondary-100 rounded-xl px-8 py-1.5'>
            {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
        </div>
    )
}

export default CountdownTimer