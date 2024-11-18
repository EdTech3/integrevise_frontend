import React from 'react';
import { FaSpinner, FaCheckCircle, FaTimesCircle } from 'react-icons/fa'; // Import icons
import { Stage } from './type';

interface Props {
    stages: Stage[]
}

const ProgressTimeline = ({ stages }: Props) => {
    const getStageClass = (status: 'loading' | 'failed' | 'successful' | 'neutral') => {
        switch (status) {
            case 'neutral':
                return 'bg-gray-300';
            case 'failed':
            case 'successful':
            case 'loading':
            default:
                return 'bg-transparent';
        }
    };

    const getIcon = (status: 'loading' | 'failed' | 'successful' | 'neutral') => {
        switch (status) {
            case 'loading':
                return <FaSpinner className="animate-spin text-white" />;
            case 'failed':
                return <FaTimesCircle className="text-red-500" />;
            case 'successful':
                return <FaCheckCircle className="text-green-400" />;
            case 'neutral':
                return null;
            default:
                return null;
        }
    };

    const getText = (stage: Stage) => {
        switch (stage.status) {
            case 'loading':
                return stage.loadingText;
            case 'failed':
                return stage.errorText;
            case 'successful':
                return stage.successText;
            case 'neutral':
                return stage.neutralText;
            default:
                return stage.label;
        }
    };

    return (
        <div className="absolute top-1/2 left-3 -translate-y-1/2 z-10 flex flex-col items-start space-y-4 p-4 bg-black/50 rounded-lg">
            {/* Progress View */}
            <div className="w-full relative">
                <div className="absolute left-2 top-4 bottom-4 w-0.5 bg-gray-300"></div> {/* Connecting Line */}
                <div className="flex flex-col space-y-8">
                    {stages.map(stage => (
                        <div key={stage.id} className="flex items-center space-x-2 relative">
                            <div className={`w-4 h-4 ${getStageClass(stage.status)} rounded-full z-10 flex items-center justify-center`}>
                                {getIcon(stage.status)}
                            </div>
                            <small>{getText(stage)}</small>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default ProgressTimeline;