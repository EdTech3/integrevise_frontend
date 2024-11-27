import { MoveRight } from 'lucide-react'
import React from 'react'

interface Props {
    status: string
}

const SubmitAssignmentSection = ({ status }: Props) => {
    return (
        <div>
            <div className='flex flex-col items-start'>
                <h2>Start New Assignment</h2>
                <MoveRight size={50} />
            </div>

            <div className='bg-secondary-100 rounded-lg p-4'>

            </div>
        </div>
    )
}

export default SubmitAssignmentSection