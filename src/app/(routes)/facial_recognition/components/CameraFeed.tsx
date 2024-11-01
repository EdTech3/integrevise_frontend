import React, { useEffect, useImperativeHandle, forwardRef } from 'react';
import { STAGE_IDS } from '../constants';

interface Props {
    deviceId: string | null;
    updateStageStatus: (stageId: string, status: 'loading' | 'failed' | 'successful') => void;
}

const CameraFeed = forwardRef<HTMLVideoElement, Props>(({ deviceId, updateStageStatus }, ref) => {
    useImperativeHandle(ref, () => videoRef.current as HTMLVideoElement);

    const videoRef = React.useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const videoElem = videoRef.current;

        const getVideoStream = async () => {
            if (!deviceId) return;

            try {
                updateStageStatus(STAGE_IDS.CAMERA_ENABLED, "loading");
                const stream = await navigator.mediaDevices.getUserMedia({ video: { deviceId } });
                if (videoElem) {
                    videoElem.srcObject = stream;
                }
                updateStageStatus(STAGE_IDS.CAMERA_ENABLED, "successful");
            } catch (error) {
                console.error("Error accessing webcam: ", error);
                updateStageStatus(STAGE_IDS.CAMERA_ENABLED, "failed");
            }
        };

        getVideoStream();

        return () => {
            if (videoElem && videoElem.srcObject) {
                const stream = videoElem.srcObject as MediaStream;
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [deviceId, updateStageStatus]);

    return <video ref={videoRef} className="w-full h-[600px] object-cover scale-x-[-1]" muted autoPlay playsInline />;
});

CameraFeed.displayName = "CameraFeed"

export default CameraFeed;