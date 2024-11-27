import React from 'react'

interface Props {
    description: string
}

const AttachedDescription = ({ description }: Props) => {
    return (
        <div>
            <h4 className='text-lg font-semibold'>Attached Description</h4>

            <p className='text-foreground text-sm font-light'>{description}</p>
        </div>
    )
}

export default AttachedDescription