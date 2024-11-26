import React from 'react'

type AssignmentMetaDataType = {
    [key: string]: string
}

interface Props {
    metadata: AssignmentMetaDataType[]
}

const AssignmentMetaData = ({ metadata }: Props) => {
    return (
        <div className='space-y-2'>
            <h4 className='text-lg font-semibold'>Metadata</h4>
            <div className='rounded-xl bg-white flex items-center justify-between border border-gray-100 py-2'>
                {metadata.map((data, idx) => {
                    return (
                        <div key={idx} className='flex items-center justify-between p-4'>
                            <p className='text-sm text-muted-foreground mr-1'>{data.key}:</p>
                            <p className='text-base font-semibold text-foreground'>{data.value}</p>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default AssignmentMetaData