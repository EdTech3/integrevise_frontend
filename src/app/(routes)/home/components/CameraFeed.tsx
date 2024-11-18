import React, { useCallback } from 'react';
import Webcam from 'react-webcam';
import { STAGE_IDS } from '../constants';

interface Props {
    deviceId: string | null;
    updateStageStatus: (stageId: string, status: 'loading' | 'failed' | 'successful') => void;
}

const CameraFeed = React.forwardRef<Webcam, Props>(({ deviceId, updateStageStatus }, ref) => {
    const handleUserMedia = useCallback(() => {
        updateStageStatus(STAGE_IDS.CAMERA_ENABLED, "successful");
    }, [updateStageStatus]);

    const handleUserMediaError = useCallback(() => {
        console.error("Error accessing webcam");
        updateStageStatus(STAGE_IDS.CAMERA_ENABLED, "failed");
    }, [updateStageStatus]);

    return (
        <Webcam
            ref={ref}
            audio={false}
            mirrored
            screenshotFormat="image/jpeg"
            className="w-full h-[600px] object-cover"
            videoConstraints={{
                deviceId: deviceId || undefined,
                facingMode: deviceId ? undefined : "user",
                width: { ideal: 1920 },
                height: { ideal: 1080 }
            }}
            onUserMedia={handleUserMedia}
            onUserMediaError={handleUserMediaError}
        />
    );
});

CameraFeed.displayName = "CameraFeed";

export default CameraFeed;