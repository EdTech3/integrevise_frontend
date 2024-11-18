import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface Props {
    setDeviceId: (value: string) => void;
    deviceId: string | null;
    devices: MediaDeviceInfo[];
    name: string
}

const Header = ({ setDeviceId, deviceId, devices, name }: Props) => {
    return (
        <div className='absolute top-0 left-0 z-10 w-full flex justify-between items-center px-4 py-2'>
            <h6>{name}</h6>

            <div className='flex flex-row items-center space-x-3'>
                <Label htmlFor="deviceSelect" className="text-sm">Select Camera</Label>
                <Select onValueChange={(value) => setDeviceId(value)} value={deviceId || ''}>
                    <SelectTrigger className="w-[180px] bg-black/50 ring-offset-gray-200 border-none focus:ring-1 focus:ring-offset-1">
                        <SelectValue placeholder="Select Camera" />
                    </SelectTrigger>
                    <SelectContent>
                        {devices.map(device => (
                            <SelectItem key={device.deviceId} value={device.deviceId}>
                                {device.label || `Camera ${device.deviceId}`}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
}

export default Header