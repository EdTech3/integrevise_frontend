import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import React from 'react'

interface Props {
    setDeviceId: (value: string) => void;
    deviceId: string | null;
    devices: MediaDeviceInfo[];
}

const AudioSelector = ({ setDeviceId, deviceId, devices }: Props) => {
    return (

        <div className='flex flex-col items-left space-y-1 self-end'>
            <Label className='uppercase text-xs font-medium text-left text-gray-600'>Select Microphone</Label>
            <Select onValueChange={(value) => setDeviceId(value)} value={deviceId || ''}>
                <SelectTrigger className=" lg:w-[170px] bg-background ring-offset-gray-900 border-2 focus:ring-1 focus:ring-offset-1">
                    <SelectValue placeholder="Select Audio Input" />
                </SelectTrigger>
                <SelectContent>
                    {devices.map(device => (
                        <SelectItem key={device.deviceId} value={device.deviceId}>
                            {device.label || `Microphone ${device.deviceId}`}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>

    )
}

export default AudioSelector