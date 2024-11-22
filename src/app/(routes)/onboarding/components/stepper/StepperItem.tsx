import React from 'react';

type StepperItemProps = {
    index: number;
    isActive: boolean;
    isCompleted: boolean;
    onClick: () => void;
};

const StepperItem: React.FC<StepperItemProps> = ({
    index,
    isActive,
    isCompleted,
    onClick,
}) => {
    return (
        <div
            className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold cursor-pointer ${
                isActive
                    ? 'bg-foreground text-white'
                    : isCompleted
                    ? 'bg-secondary-100 text-foreground'
                    : 'bg-gray-200 text-gray-700'
            }`}
            onClick={onClick}
        >
            {index}
        </div>
    );
};

export default StepperItem;
