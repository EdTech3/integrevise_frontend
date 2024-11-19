import React from 'react'


// interface Props {
//     overallAssessment: string
// }

const VivaEvaluationSection = () => {
    const placeholderAssessment = `The candidate has demonstrated a commendable performance in today's viva voce examination, achieving an overall score of 85%. Throughout the session, they exhibited a solid grasp of fundamental concepts and showed particular strength in theoretical understanding. Their responses were articulate and well-structured, effectively demonstrating the ability to connect theoretical knowledge with practical applications.

The candidate's strongest moments came during discussions of core methodologies, where they provided clear, detailed explanations supported by relevant examples. Their ability to maintain professional composure while handling complex questions was particularly noteworthy. The responses showed evidence of thorough preparation and familiarity with course materials.`

    return (
        <section>
            <h2 className='text-2xl font-bold'>Viva Questions</h2>
            <p className='text-sm font-light'>
                {placeholderAssessment}
            </p>
        </section>
    )
}

export default VivaEvaluationSection