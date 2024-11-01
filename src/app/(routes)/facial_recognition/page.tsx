"use client"
import Logo from "@/components/shared/Logo"
import { Button } from "@/components/ui/button"
import * as faceapi from "face-api.js"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useCallback, useEffect, useRef, useState } from "react"
import Header from "./components/Header"
import ProgressTimeline from "./components/ProgressTimeline"
import { Stage } from "./components/type"


const FacialRecognition = () => {
  const searchParams = useSearchParams()
  const isMethodPresent = searchParams.has("method")

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [deviceId, setDeviceId] = useState<string | null>(null)
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([])
  const [modelsLoaded, setModelsLoaded] = useState(false)
  const [stages, setStages] = useState<Stage[]>([
    {
      id: "cameraEnabled",
      label: "Camera Enabled",
      status: "neutral",
      loadingText: "Getting Camera",
      errorText: "Camera Error",
      successText: "Camera Ready",
      neutralText: "Camera Not Started",
    },
    {
      id: "faceRecognized",
      label: "Facial Recognition",
      status: "neutral",
      loadingText: "Performing Face Recognition",
      errorText: "Recognition Failed",
      successText: "Face Recognized",
      neutralText: "Recognition Not Started",
    },
  ]);


  const updateDevices = useCallback(async () => {
    // Fetch all media devices available on the system
    const devices = await navigator.mediaDevices.enumerateDevices()

    // Filter out only the video input devices (cameras)
    const videoDevices = devices.filter(device => device.kind === "videoinput")

    // Update the state with the list of video devices
    setDevices(videoDevices)

    // If there are video devices available and no deviceId is set, set the first video device as the default
    if (videoDevices.length > 0 && !deviceId) {
      setDeviceId(videoDevices[0].deviceId)
    }
  }, [deviceId])

  const updateStageStatus = (stageId: string, status: "loading" | "failed" | "successful") => {
    setStages(prevStages =>
      prevStages.map(stage =>
        stage.id === stageId ? { ...stage, status } : stage
      )
    );
  };

  // Load models
  const loadModels = async () => {
    const MODEL_URL = "https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights"
    await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL)
    await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL)
    await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
    setModelsLoaded(true)
  }

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d")
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth
        canvasRef.current.height = videoRef.current.videoHeight
        context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height)
        const imageData = canvasRef.current.toDataURL("image/png")
        setCapturedImage(imageData)
        return imageData
      }
    }
  }

  const performFaceRecognition = useCallback(async (imageData: string) => {

    updateStageStatus('faceRecognized', 'loading')
    const capturedImageElement = new Image()
    capturedImageElement.crossOrigin = "anonymous"
    capturedImageElement.src = imageData

    if (!modelsLoaded) {
      alert("Models are not loaded yet. Please wait.")
      return
    }

    capturedImageElement.onload = async () => {
      const capturedDetections = await faceapi.detectAllFaces(capturedImageElement).withFaceLandmarks().withFaceDescriptors()
      const referenceImageElement = document.getElementById("referenceImage") as HTMLImageElement
      referenceImageElement.crossOrigin = "anonymous"
      const referenceDetections = await faceapi.detectAllFaces(referenceImageElement).withFaceLandmarks().withFaceDescriptors()

      if (capturedDetections.length > 1) {
        alert("Multiple faces detected in the captured image. Please ensure only one face is visible.")
        updateStageStatus('faceRecognized', 'failed');
        return
      }

      if (referenceDetections.length > 1) {
        alert("Multiple faces detected in the reference image. Please ensure only one face is visible.")
        updateStageStatus('faceRecognized', 'failed')
        return
      }

      if (capturedDetections.length === 1 && referenceDetections.length === 1) {
        const distance = faceapi.euclideanDistance(capturedDetections[0].descriptor, referenceDetections[0].descriptor)
        if (distance < 0.6) {
          updateStageStatus('faceRecognized', 'successful')
          alert("Face Matched")
        } else {
          alert("Face not matched!")
          updateStageStatus('faceRecognized', 'failed')
        }
      } else {
        alert("No face detected in one of the images.")
        updateStageStatus('faceRecognized', 'failed')
      }
    }
  }, [modelsLoaded])

  useEffect(() => {
    loadModels()
  }, [])

  // This useEffect hook initializes the list of media devices when the component mounts and sets up an event listener to update the list whenever the media devices change. It also cleans up the event listener when the component unmounts.
  useEffect(() => {
    updateDevices()

    navigator.mediaDevices.ondevicechange = updateDevices

    return () => {
      navigator.mediaDevices.ondevicechange = null
    }
  }, [updateDevices])

  useEffect(() => {
    const videoElem = videoRef.current

    const getVideoStream = async () => {
      if (!deviceId) return

      try {
        updateStageStatus("cameraEnabled", "loading")
        const stream = await navigator.mediaDevices.getUserMedia({ video: { deviceId } })
        if (videoElem) {
          videoElem.srcObject = stream
        }
        setPermissionGranted(true)
        updateStageStatus("cameraEnabled", "successful");
      } catch (error) {
        console.error("Error accessing webcam: ", error)
        setPermissionGranted(false)
        updateStageStatus("cameraEnabled", "failed");

      }
    }

    getVideoStream()

    return () => {
      if (videoElem && videoElem.srcObject) {
        const stream = videoElem.srcObject as MediaStream
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [deviceId])


  useEffect(() => {
    const returnedImage = captureImage()

    if (returnedImage) {
      performFaceRecognition(returnedImage)
    }

  }, [performFaceRecognition])

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
    <main className="py-2 min-h-screen flex flex-col space-y-4">
      <Logo />

      <div className="relative overlay rounded-lg overflow-hidden text-gray-200">
        <Header deviceId={deviceId} devices={devices} name="Chloe Decker" setDeviceId={setDeviceId} />
        <ProgressTimeline stages={stages} />

        {/* Camera Feed */}
        <video ref={videoRef} className="w-full h-[600px] object-cover scale-x-[-1]" muted autoPlay playsInline />
        <canvas ref={canvasRef} style={{ display: "none" }} />
      </div>

      <Button
        disabled={stages[1].status !== "successful"}
        className="w-full"
      >
        Continue
      </Button>

      <img src="/test_image/kelvin.jpeg" id="referenceImage" className="hidden" />

      {capturedImage && (
        <div>
          <h3>Captured Image:</h3>
          <img src={capturedImage} alt="Captured Image" width={500} height={500} />
        </div>
      )}


    </main>
  )
}

export default FacialRecognition