import AssignmentCard from '@/app/(routes)/dashboard/components/AssignmentCard'
import React from 'react'

interface Props {
    params: {
        id: string
    }
}

const CourseInstancePage = ({ params }: Props) => {
    return (
        <div>
            <h2 className='text-2xl font-semibold mb-5'>EC - 100 ECONOMICS</h2>

            <div className='space-y-2 mb-14'>
                <h3 className='text-muted-foreground text-base font-semibold'>Current Assignments</h3>
                <div className='grid gap-4 grid-cols-[repeat(auto-fit,minmax(250px,1fr))]'>
                    <AssignmentCard courseId={params.id} assignmentId="1" title='Assignment 1' description='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet urna nec nunc.' dueDate='12/12/2024' />
                    <AssignmentCard courseId={params.id} assignmentId="2" title='Assignment 2' description='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet urna nec nunc.' dueDate='12/12/2024' />
                    <AssignmentCard courseId={params.id} assignmentId="3" title='Assignment 3' description='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet urna nec nunc.' dueDate='12/12/2024' />
                </div>
            </div>

            <div className='space-y-2'>
                <h3 className='text-muted-foreground text-base font-semibold'>Past Assignments</h3>
                <div className='grid gap-4 grid-cols-[repeat(auto-fit,minmax(250px,1fr))]'>
                    <AssignmentCard courseId={params.id} assignmentId="4" title='Assignment 1' description='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet urna nec nunc.' dueDate='12/12/2021' />
                    <AssignmentCard courseId={params.id} assignmentId="5" title='Assignment 2' description='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet urna nec nunc.' dueDate='12/12/2021' />
                    <AssignmentCard courseId={params.id} assignmentId="6" title='Assignment 3' description='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet urna nec nunc.' dueDate='12/12/2021' />
                </div>
            </div>
        </div>
    )
}

export default CourseInstancePage