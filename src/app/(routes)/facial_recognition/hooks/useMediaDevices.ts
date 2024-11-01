import { useState, useCallback, useEffect } from 'react';

const useMediaDevices = (deviceId: string | null, setDeviceId: (id: string) => void) => {
    const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);

    const updateDevices = useCallback(async () => {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        setDevices(videoDevices);

        if (videoDevices.length > 0 && !deviceId) {
            setDeviceId(videoDevices[0].deviceId);
        }
    }, [deviceId, setDeviceId]);

    useEffect(() => {
        updateDevices();
        navigator.mediaDevices.ondevicechange = updateDevices;

        return () => {
            navigator.mediaDevices.ondevicechange = null;
        };
    }, [updateDevices]);

    return devices;
};

export default useMediaDevices;