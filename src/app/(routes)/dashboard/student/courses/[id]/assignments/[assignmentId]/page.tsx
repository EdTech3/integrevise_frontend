import AssignmentMetaData from '@/app/(routes)/dashboard/components/AssignmentMetaData'
import AttachedDescription from '@/app/(routes)/dashboard/components/AttachedDescription'
import AttachedDocuments from '@/app/(routes)/dashboard/components/AttachedDocuments'
import SubmitAssignmentSection from '@/app/(routes)/dashboard/components/SubmitAssignmentSection'
import { Button } from '@/components/ui/button'
import React from 'react'


const AssignmentInstancePage = () => {
    return (
        <section className='space-y-10'>
            <h2 className='text-3xl font-semibold'>Assignment 1</h2>

            <AssignmentMetaData metadata={[
                { key: 'Due Date', value: '12/12/2024' },
                { key: 'Submission', value: 'Integrevise' },
                { key: 'Points', value: '100' },
                { key: 'Available', value: '10th November 2024 at 9:00 - 20th November 2024 at 8.00' }
            ]} />


            <AttachedDocuments />
            <AttachedDescription description={`This assessment is designed to challenge your critical thinking and problem-solving skills in a real-world context. While the brief outlines the technical requirements, remember that creativity and innovation are highly valued. We encourage you to think outside the box and bring your unique perspective to the project.This assignment not only tests your understanding of course materials but also prepares you for future professional challenges where you'll need to apply theoretical knowledge to practical situations. Good luck`} />


            {/* <SubmitAssignmentSection status="new" /> */}

            <Button>Submit Assignment</Button>




        </section>
    )
}

export default AssignmentInstancePage