"use client"
import Logo from "@/components/shared/Logo"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useRef, useState } from "react"
import CameraFeed from "./components/CameraFeed"
import Header from "./components/Header"
import ProgressTimeline from "./components/ProgressTimeline"
import ReferenceImage from "./components/ReferenceImage"
import { Stage } from "./components/type"
import { STAGE_IDS } from "./constants"
import useLoadModels from "./hooks/useLoadModels"
import useMediaDevices from "./hooks/useMediaDevices"
import { captureImage } from "./utils/captureImage"
import { compareFaces, detectFaces } from "./utils/faceDetection"
import Container from "@/components/shared/Container"


const FacialRecognition = () => {
  const searchParams = useSearchParams()
  const isMethodPresent = searchParams.has("method")

  const router = useRouter()
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [deviceId, setDeviceId] = useState<string | null>(null)

  const modelsLoaded = useLoadModels()
  const devices = useMediaDevices(deviceId, setDeviceId)
  const [stages, setStages] = useState<Stage[]>([
    {
      id: STAGE_IDS.CAMERA_ENABLED,
      label: "Camera Enabled",
      status: "neutral",
      loadingText: "Getting Camera",
      errorText: "Camera Error",
      successText: "Camera Ready",
      neutralText: "Camera Not Started",
    },
    {
      id: STAGE_IDS.FACE_RECOGNIZED,
      label: "Facial Recognition",
      status: "neutral",
      loadingText: "Performing Face Recognition",
      errorText: "Recognition Failed",
      successText: "Face Recognized",
      neutralText: "Recognition Not Started",
    },
  ]);


  const updateStageStatus = useCallback((stageId: string, status: "loading" | "failed" | "successful") => {
    setStages(prevStages =>
      prevStages.map(stage =>
        stage.id === stageId ? { ...stage, status } : stage
      )
    );
  }, [])

  const handleCaptureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const imageData = captureImage(videoRef.current, canvasRef.current);

      if (imageData) {
        setCapturedImage(imageData);
        return imageData;
      }
    }
    return null;
  };

  const performFaceRecognition = useCallback(async (imageData: string) => {
    updateStageStatus(STAGE_IDS.FACE_RECOGNIZED, 'loading');
    const capturedImageElement = new Image();
    capturedImageElement.crossOrigin = 'anonymous';
    capturedImageElement.src = imageData;

    if (!modelsLoaded) return;

    capturedImageElement.onload = async () => {
      const capturedDetections = await detectFaces(capturedImageElement);
      const referenceImageElement = document.getElementById('referenceImage') as HTMLImageElement;
      referenceImageElement.crossOrigin = 'anonymous';
      const referenceDetections = await detectFaces(referenceImageElement);

      if (capturedDetections.length > 1) {
        alert('Multiple faces detected in the captured image. Please ensure only one face is visible.');
        updateStageStatus(STAGE_IDS.FACE_RECOGNIZED, 'failed');
        return;
      }

      if (referenceDetections.length > 1) {
        alert('Multiple faces detected in the reference image. Please ensure only one face is visible.');
        updateStageStatus(STAGE_IDS.FACE_RECOGNIZED, 'failed');
        return;
      }

      if (capturedDetections.length === 1 && referenceDetections.length === 1) {
        const distance = compareFaces(capturedDetections[0].descriptor, referenceDetections[0].descriptor);
        if (distance < 0.6) {
          updateStageStatus(STAGE_IDS.FACE_RECOGNIZED, 'successful');
          alert('Face Matched');
        } else {
          alert('Face not matched!');
          updateStageStatus(STAGE_IDS.FACE_RECOGNIZED, 'failed');
        }
      } else {
        alert('No face detected in one of the images.');
        updateStageStatus(STAGE_IDS.FACE_RECOGNIZED, 'failed');
      }
    };
  }, [modelsLoaded, updateStageStatus]);

  const handleRecognitionButtonClicked = () => {
    const returnedImage = handleCaptureImage()
    if (returnedImage) performFaceRecognition(returnedImage)
  }


  if (!isMethodPresent) return (
    <div>
      <p>Please choose a communication method <Link href={"/communication_method_selection"}>here</Link></p>
    </div>
  )

  return (
    <Container >
      <main className="py-2 min-h-screen flex flex-col space-y-4">
        <Logo />

        <div className="relative overlay rounded-lg overflow-hidden text-gray-200">
          <Header deviceId={deviceId} devices={devices} name="Chloe Decker" setDeviceId={setDeviceId} />
          <ProgressTimeline stages={stages} />
          <CameraFeed deviceId={deviceId} updateStageStatus={updateStageStatus} ref={videoRef} />
          <canvas ref={canvasRef} style={{ display: "none" }} />
        </div>

        <Button
          onClick={handleRecognitionButtonClicked}
          disabled={stages[0].status === "loading" || stages[0].status === "successful"}
          variant={"outline"}
          className="w-full"
        >
          {stages[0].status === "failed" ? "Try again?" : "Start Recognition"}
        </Button>

        <Button
          disabled={stages[1].status !== "successful"}
          onClick={() => {
            router.push("/audio_test")
          }}
          className="w-full"
        >
          Continue
        </Button>

        <ReferenceImage />

        {capturedImage && (
          <div>
            <h3>Captured Image:</h3>
            <img src={capturedImage} alt="Captured Image" width={500} height={500} />
          </div>
        )}

      </main>
    </Container>
  )
}

export default FacialRecognition