import React from 'react';
import { FaCheckCircle, FaCircle } from 'react-icons/fa'; // Import icons from react-icons

interface TimelineOption {
    id: string;
    label: string;
}

interface HorizontalTimelineProps {
    options: TimelineOption[];
    activeId: string | null;
    className?: string
}

const HorizontalTimeline: React.FC<HorizontalTimelineProps> = ({ options, activeId, className }) => {
    const activeIndex = options.findIndex(option => option.id === activeId);

    return (
        <div className={`flex flex-row items-center p-4 ${className}`}>
            {options.map((option, index) => (
                <React.Fragment key={option.id}>
                    <div className="flex items-center space-x-2">
                        {index < activeIndex ? (
                            // Completed step: checkmark icon and foreground color
                            <FaCheckCircle className="text-foreground" />
                        ) : index === activeIndex ? (
                            // Active step: circle icon and blue color
                            <FaCircle className="text-foreground" />
                        ) : (
                            // Future step: circle icon and secondary color
                            <FaCircle className="text-secondary-200" />
                        )}
                        <span
                            className={`${index < activeIndex
                                ? // Completed step: foreground text,
                                'text-foreground  p-1 rounded'
                                : index === activeIndex
                                    ? // Active step: green text
                                    'text-background-500 underline'
                                    : // Future step: secondary text
                                    'text-secondary-200'
                                }`}
                        >
                            {option.label}
                        </span>
                    </div>
                    {index < options.length - 1 && (
                        <div className="flex-grow h-px bg-gray-300 mx-2"></div>
                    )}
                </React.Fragment>
            ))}
        </div>
    );
};

export default HorizontalTimeline;