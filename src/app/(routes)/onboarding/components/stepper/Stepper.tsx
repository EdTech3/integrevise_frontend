import React from 'react';
import StepperItem from './StepperItem';

type Step = {
    title: string;
    component: React.ComponentType<any>;
};

type StepperProps = {
    steps: Step[];
    currentStepIndex: number;
    onNext: () => void;
    onPrev: () => void;
    onJump: (stepIndex: number) => void;
};

const Stepper: React.FC<StepperProps> = ({
    steps,
    currentStepIndex,
    onNext,
    onPrev,
    onJump,
}) => {
    return (
        <div className="flex items-center w-full max-w-3xl mx-auto space-x-2">
            {steps.map((step, index) => (
                <div key={step.title} className="flex items-center w-full">
                    {/* Step */}
                    <StepperItem
                        index={index + 1}
                        isActive={index === currentStepIndex}
                        isCompleted={index < currentStepIndex}
                        onClick={() => onJump(index)}
                    />
                    {/* Connector */}
                    {index < steps.length - 1 && (
                        <div
                            className={`flex-grow h-0.5 ${
                                index < currentStepIndex
                                    ? 'bg-foreground'
                                    : 'bg-gray-300'
                            }`}
                        />
                    )}
                </div>
            ))}
           
        </div>
    );
};

export default Stepper;
