import React, { useState, useEffect, useRef } from 'react';

import { AIAvatarExpression } from '../type';

interface AIAvatarProps {
    expression?: AIAvatarExpression;
    size?: number;
}

const AIAvatar = ({ expression = 'neutral', size = 100 }: AIAvatarProps) => {
    const [eyePosition, setEyePosition] = useState({ x: 0, y: 0 });
    const [isBlinking, setIsBlinking] = useState(false);
    const [headTilt, setHeadTilt] = useState(0);
    const [eyebrowState, setEyebrowState] = useState('neutral');
    const avatarRef = useRef<SVGSVGElement>(null);

    // Handle mouse movement for eye tracking
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!avatarRef.current || expression === 'speaking') return;
            const bounds = avatarRef.current.getBoundingClientRect();
            const centerX = bounds.left + bounds.width / 2;
            const centerY = bounds.top + bounds.height / 2;

            const deltaX = (e.clientX - centerX) / 100;
            const deltaY = (e.clientY - centerY) / 100;

            setEyePosition({
                x: Math.min(Math.max(deltaX, -2), 2),
                y: Math.min(Math.max(deltaY, -1), 1)
            });
        };

        document.addEventListener('mousemove', handleMouseMove);
        return () => document.removeEventListener('mousemove', handleMouseMove);
    }, [expression]);

    // Blinking animation
    useEffect(() => {
        const blinkInterval = setInterval(() => {
            setIsBlinking(true);
            setTimeout(() => setIsBlinking(false), 150);
        }, 3000 + Math.random() * 2000);

        return () => clearInterval(blinkInterval);
    }, []);

    // Idle animation and head tilt
    useEffect(() => {
        if (expression === 'neutral') {
            const idleInterval = setInterval(() => {
                setHeadTilt(Math.sin(Date.now() / 2000) * 1);
            }, 50);
            return () => clearInterval(idleInterval);
        }
    }, [expression]);

    // Expression-based eyebrow control
    useEffect(() => {
        switch (expression) {
            case 'thinking':
                setEyebrowState('raised');
                break;
            case 'attentive':
                setEyebrowState('focused');
                break;
            case 'engaged':
                setEyebrowState('animated');
                break;
            default:
                setEyebrowState('neutral');
        }
    }, [expression]);

    return (
        <svg
            ref={avatarRef}
            width={size}
            height={size}
            viewBox="0 0 100 100"
            className="ai-avatar"
            style={{
                transform: `rotate(${headTilt}deg)`,
                transition: 'transform 0.3s ease-out'
            }}
        >
            {/* Background hexagonal grid */}
            <pattern id="hexGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path
                    d="M5,0 L10,2.5 L10,7.5 L5,10 L0,7.5 L0,2.5 Z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.5"
                    className="hexagon-bg"
                />
            </pattern>
            <rect width="100" height="100" fill="url(#hexGrid)" opacity="0.1" />

            {/* Main hexagonal face */}
            <path
                d="M50,10 L80,25 L80,75 L50,90 L20,75 L20,25 Z"
                fill="#eef5f7"
                className="face-hex"
            />

            {/* Circuit traces */}
            <path
                d="M20,25 L35,25 M80,75 L65,75 M50,90 L50,80"
                stroke="#86c5d8"
                strokeWidth="1"
                fill="none"
                className="circuit-trace"
            />

            {/* Antennae */}
            <g className="antenna">
                <line
                    x1="35"
                    y1="15"
                    x2="35"
                    y2="5"
                    stroke="#333"
                    strokeWidth="2"
                    className={expression === 'thinking' ? 'thinking-antenna' : ''}
                />
                <line
                    x1="65"
                    y1="15"
                    x2="65"
                    y2="5"
                    stroke="#333"
                    strokeWidth="2"
                    className={expression === 'thinking' ? 'thinking-antenna' : ''}
                />
                <circle cx="35" cy="5" r="1.5" fill="#333" />
                <circle cx="65" cy="5" r="1.5" fill="#333" />
            </g>

            {/* Eyebrows - Dynamic based on state */}
            <g className="eyebrows" style={{ transition: 'transform 0.3s ease' }}>
                <path
                    d={`M30 ${eyebrowState === 'raised' ? '33' : '35'} 
                       Q35 ${eyebrowState === 'focused' ? '30' : '32'} 
                       40 ${eyebrowState === 'raised' ? '33' : '35'}`}
                    stroke="#333"
                    strokeWidth="2"
                    fill="none"
                />
                <path
                    d={`M60 ${eyebrowState === 'raised' ? '33' : '35'} 
                       Q65 ${eyebrowState === 'focused' ? '30' : '32'} 
                       70 ${eyebrowState === 'raised' ? '33' : '35'}`}
                    stroke="#333"
                    strokeWidth="2"
                    fill="none"
                />
            </g>

            {/* Eyes - now centered during speech */}
            <g className="eyes">
                <g transform={`translate(${expression === 'speaking' ? 0 : eyePosition.x * 2}, 
                                      ${expression === 'speaking' ? 0 : eyePosition.y * 2})`}>
                    <circle
                        cx="35"
                        cy="45"
                        r={isBlinking ? 0.5 : 5}
                        fill="#333"
                        style={{ transition: 'r 0.1s ease' }}
                    />
                    <circle
                        cx="65"
                        cy="45"
                        r={isBlinking ? 0.5 : 5}
                        fill="#333"
                        style={{ transition: 'r 0.1s ease' }}
                    />
                </g>
            </g>

            {/* Mouth - Expression based */}
            {expression === 'neutral' && (
                <path
                    d="M35 65 Q50 70 65 65"
                    stroke="#333"
                    strokeWidth="2"
                    fill="none"
                />
            )}
            {expression === 'speaking' && (
                <path
                    d="M35 65 Q50 70 65 65 L65 68 Q50 73 35 68 Z"
                    fill="#333"
                    className="speaking-mouth"
                />
            )}
            {expression === 'thinking' && (
                <>
                    <path
                        d="M35 65 Q50 68 65 65"
                        stroke="#333"
                        strokeWidth="2"
                        fill="none"
                    />
                    <circle cx="75" cy="35" r="3" fill="#333" className="thinking-bubble" />
                </>
            )}
            {expression === 'engaged' && (
                <path
                    d="M35 63 Q50 75 65 63"
                    stroke="#333"
                    strokeWidth="3"
                    fill="none"
                />
            )}
            {expression === 'attentive' && (
                <path
                    d="M35 65 Q50 67 65 65"
                    stroke="#333"
                    strokeWidth="2"
                    fill="none"
                />
            )}
        </svg>
    );
};

export default AIAvatar;

