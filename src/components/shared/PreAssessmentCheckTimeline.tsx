import React, { useState } from 'react'
import HorizontalTimeline from './HorizontalTimeline';

interface Props {
    selectedId: "facial-recognition" | "microphone-test"
}

const PreAssessmentCheckTimeline = ({ selectedId }: Props) => {

    const [activeId,] = useState<string>(selectedId);

    const timelineOptions = [
        { id: 'facial-recognition', label: 'Facial Recognition' },
        { id: 'microphone-test', label: 'Microphone Test' },
    ];
    return (
        <HorizontalTimeline options={timelineOptions} activeId={activeId} className='w-full mx-auto max-w-xl' />
    )
}

export default PreAssessmentCheckTimeline