import { Card } from '@/components/ui/card'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

interface Props {
    title: string
    image: string
    id: string
}

const StudentCourseCard = ({ title, image, id }: Props) => {
    return (
        <Link href={`/dashboard/student/courses/${id}/assignments`} className='group'>
            <Card className='relative cursor-pointer rounded-xl overflow-clip bg-white shadow-md group-hover:bg-gray-100 transition-colors'>
                <figure className='relative w-full h-[120px]'>
                    <Image src={image} alt="course image" fill={true} objectFit='cover' />
                </figure>
                <h3 className='text-sm font-light px-4 py-2.5'>{title}</h3>
            </Card>
        </Link>

    )
}

export default StudentCourseCard