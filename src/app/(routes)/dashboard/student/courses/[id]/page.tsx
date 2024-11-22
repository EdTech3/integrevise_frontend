import React from 'react'

interface Props {
    params: {
        id: string
    }
}

const CourseInstancePage = ({ params }: Props) => {
    return (
        <div className='space-y-4'>
            <h2 className='text-2xl font-semibold'>Course Overview</h2>
            <div className='bg-white rounded-lg p-4 shadow-sm'>
                <p>Course ID: {params.id}</p>
                {/* Add course content here */}
            </div>
        </div>
    )
}

export default CourseInstancePage