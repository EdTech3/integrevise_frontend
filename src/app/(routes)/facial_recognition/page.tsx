"use client"
import Logo from '@/components/shared/Logo'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from '@/components/ui/label'


const FacialRecognition = () => {
  const searchParams = useSearchParams()
  const isMethodPresent = searchParams.has("method")

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [deviceId, setDeviceId] = useState<string | null>(null)
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([])

  const updateDevices = useCallback(async () => {
    // Fetch all media devices available on the system
    const devices = await navigator.mediaDevices.enumerateDevices()

    // Filter out only the video input devices (cameras)
    const videoDevices = devices.filter(device => device.kind === 'videoinput')

    // Update the state with the list of video devices
    setDevices(videoDevices)

    // If there are video devices available and no deviceId is set, set the first video device as the default
    if (videoDevices.length > 0 && !deviceId) {
      setDeviceId(videoDevices[0].deviceId)
    }
  }, [deviceId])


  const captureImage = () => {
    // High level: Captures an image from the video stream and stores it as a data URL.
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d')
      if (context) {
        // Set the canvas dimensions to match the video dimensions
        canvasRef.current.width = videoRef.current.videoWidth
        canvasRef.current.height = videoRef.current.videoHeight

        // Draw the current frame from the video onto the canvas
        context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height)

        // Convert the canvas content to a data URL (base64 encoded image)
        const imageData = canvasRef.current.toDataURL('image/png')

        // Update the state with the captured image data URL
        setCapturedImage(imageData)
      }
    }
  }


  // This useEffect hook initializes the list of media devices when the component mounts and sets up an event listener to update the list whenever the media devices change. It also cleans up the event listener when the component unmounts.
  useEffect(() => {
    updateDevices()

    navigator.mediaDevices.ondevicechange = updateDevices

    return () => {
      navigator.mediaDevices.ondevicechange = null
    }
  }, [updateDevices])



  useEffect(() => {
    const getVideoStream = async () => {
      if (!deviceId) return

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { deviceId } })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
        setPermissionGranted(true)
      } catch (error) {
        console.error("Error accessing webcam: ", error)
        setPermissionGranted(false)
      }
    }

    getVideoStream()

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [deviceId])


  if (!isMethodPresent) return (
    <div>
      <p>Please choose a communication method <Link href={"/communication_method_selection"}>here</Link></p>
    </div>
  )

  if (permissionGranted === false) return (
    <div>
      <p>Video permission is required to proceed. Please allow access to your webcam.</p>
    </div>
  )

  return (
    <main className='py-2 min-h-screen flex flex-col space-y-4'>
      <Logo />

      <div className='relative overlay rounded-lg overflow-hidden'>
        {/* Header */}
        <div className='absolute top-0 left-0 z-10 w-full flex justify-between items-center px-4 py-2'>
          <h6 className='text-background '>Chloe decker</h6>

          <div className='flex flex-row items-center space-x-3'>
            <Label htmlFor="deviceSelect" className="text-sm text-background">Select Camera </Label>
            <Select onValueChange={(value) => setDeviceId(value)} value={deviceId || ''}>
              <SelectTrigger className="w-[180px]">
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

        {/* Camera Feed */}
        <video ref={videoRef} className='w-full h-[600px] object-cover scale-x-[-1]' muted autoPlay playsInline />

        <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
      </div>

      <Button className='w-full' onClick={captureImage}>
        Capture Image
      </Button>
      {capturedImage && (
        <div>
          <h3>Captured Image:</h3>
          <Image src={capturedImage} alt="Captured Image" width={500} height={500} />
        </div>
      )}


    </main>
  )
}

export default FacialRecognition