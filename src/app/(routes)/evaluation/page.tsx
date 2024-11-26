import Container from '@/components/shared/Container';
import React from 'react'
import StudentInfoCard from './components/StudentInfoCard';
import VivaEvaluationSection from './components/VivaEvaluationSection';

const EvaluationPage = () => {
    return (
        <main className='py-12'>
            <Container className='space-y-16'>
                <StudentInfoCard
                    name='Kyle Snow'
                    image='/test_image/face2.jpeg'
                    number='1234567890'
                    vivaStatus='Pass'
                    startDate='2021-01-01'
                    endDate='2021-01-01'
                    duration='1 hour'
                    incident={0}
                />
                <VivaEvaluationSection />
            </Container>
        </main>
    )
}

export default EvaluationPage;