import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from 'next/link'

interface Props {
    title: string
    description: string
    dueDate: string
    courseId: string
    assignmentId: string
}

const AssignmentCard = ({ title, description, dueDate, courseId, assignmentId }: Props) => {
    // Check if date is past due
    const isOverdue = new Date(dueDate) < new Date()

    return (
        <Link href={`/dashboard/student/courses/${courseId}/assignments/${assignmentId}`} className='group cursor-pointer'>
            <Card className='group-hover:bg-gray-100 transition-colors'>
                <CardHeader>
                    <CardTitle className="text-xl font-normal">{title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-base text-muted-foreground">
                        {description}
                    </p>
                    <div className="inline-block ml-auto">
                        <span className={` ${isOverdue ? 'bg-red-100 text-red-700' : 'bg-secondary-100 text-foreground'}  px-3 py-1 rounded-md text-sm`}>
                            Date due: {dueDate}
                        </span>
                    </div>
                </CardContent>
            </Card>
        </Link>

    )
}

export default AssignmentCard