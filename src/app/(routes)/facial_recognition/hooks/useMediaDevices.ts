import { useState, useCallback, useEffect } from 'react';

const useMediaDevices = (
  deviceId: string | null,
  setDeviceId: (id: string) => void,
  kind: MediaDeviceKind = 'videoinput'
) => {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);

  const updateDevices = useCallback(async () => {
    const allDevices = await navigator.mediaDevices.enumerateDevices();
    const filteredDevices = allDevices.filter((device) => device.kind === kind);
    setDevices(filteredDevices);

    if (filteredDevices.length > 0 && !deviceId) {
      setDeviceId(filteredDevices[0].deviceId);
    }
  }, [deviceId, setDeviceId, kind]);

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