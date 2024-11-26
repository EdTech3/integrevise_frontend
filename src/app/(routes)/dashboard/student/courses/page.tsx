import React from 'react';
import StudentCourseCard from '../../components/StudentCourseCard';

const StudentCourses = () => {
    return (
        <div className='space-y-2'>
            <h3>Courses</h3>
            <div className='grid gap-4 grid-cols-[repeat(auto-fill,minmax(250px,1fr))]'>
                <StudentCourseCard id="abc123" title='Course 1' image='https://picsum.photos/seed/picsum/200/300' />
                <StudentCourseCard id="def456" title='Course 2' image='https://picsum.photos/seed/picsum/200/300' />
                <StudentCourseCard id="ghi789" title='Course 3' image='https://picsum.photos/seed/picsum/200/300' />
                <StudentCourseCard id="jkl012" title='Course 4' image='https://picsum.photos/seed/picsum/200/300' />
                <StudentCourseCard id="mno345" title='Course 5' image='https://picsum.photos/seed/picsum/200/300' />
                <StudentCourseCard id="pqr678" title='Course 6' image='https://picsum.photos/seed/picsum/200/300' />
            </div>
        </div>
    );
}

export default StudentCourses;