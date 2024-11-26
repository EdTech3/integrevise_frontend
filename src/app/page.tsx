"use client"
import Container from "@/components/shared/Container"
import Logo from "@/components/shared/Logo"
import PreAssessmentCheckTimeline from "@/components/shared/PreAssessmentCheckTimeline"
import { Button } from "@/components/ui/button"
import { errorToast, successToast } from "@/lib/toast"
import { useRouter } from "next/navigation"
import { useCallback, useRef, useState } from "react"
import Webcam from 'react-webcam'
import CameraFeed from "./(routes)/home/components/CameraFeed"
import Header from "./(routes)/home/components/Header"
import ProgressTimeline from "./(routes)/home/components/ProgressTimeline"
import ReferenceImage from "./(routes)/home/components/ReferenceImage"
import { Stage } from "./(routes)/home/components/type"
import { STAGE_IDS } from "./(routes)/home/constants"
import useLoadModels from "./(routes)/home/hooks/useLoadModels"
import useMediaDevices from "./(routes)/home/hooks/useMediaDevices"
import { compareFaces, detectFaces } from "./(routes)/home/utils/faceDetection"


const Home = () => {

  const router = useRouter()
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [deviceId, setDeviceId] = useState<string | null>(null)
  const webcamRef = useRef<Webcam>(null)

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

  const handleCaptureImage = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setCapturedImage(imageSrc);
        return imageSrc;
      }
    }
    return null;
  }, []);

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
        errorToast('Multiple faces detected in the captured image. Please ensure only one face is visible.');
        updateStageStatus(STAGE_IDS.FACE_RECOGNIZED, 'failed');
        return;
      }

      if (referenceDetections.length > 1) {
        errorToast('Multiple faces detected in the reference image. Please ensure only one face is visible.');
        updateStageStatus(STAGE_IDS.FACE_RECOGNIZED, 'failed');
        return;
      }

      if (capturedDetections.length === 1 && referenceDetections.length === 1) {
        const distance = compareFaces(capturedDetections[0].descriptor, referenceDetections[0].descriptor);
        if (distance < 0.6) {
          updateStageStatus(STAGE_IDS.FACE_RECOGNIZED, 'successful');
          successToast('Face Matched Successfully!');
        } else {
          errorToast('Face not matched. Please try again.');
          updateStageStatus(STAGE_IDS.FACE_RECOGNIZED, 'failed');
        }
      } else {
        errorToast('No face detected in one of the images.');
        updateStageStatus(STAGE_IDS.FACE_RECOGNIZED, 'failed');
      }
    };
  }, [modelsLoaded, updateStageStatus]);

  const handleRecognitionButtonClicked = () => {
    const returnedImage = handleCaptureImage()
    if (returnedImage) performFaceRecognition(returnedImage)
  }


  const getFacialRecognitionButtonText = () => {
    if (stages[1].status === "failed") return "Try again?"
    if (stages[1].status === "loading") return "Performing Recognition"
    return "Start Recognition"
  }


  return (
    <Container >
      <main className="py-2 min-h-screen flex flex-col space-y-4">
        <Logo />
        <PreAssessmentCheckTimeline selectedId="facial-recognition" />

        <div className="relative overlay rounded-lg overflow-hidden text-gray-200">
          <Header deviceId={deviceId} devices={devices} name="Kyle" setDeviceId={setDeviceId} />
          <ProgressTimeline stages={stages} />
          <CameraFeed deviceId={deviceId} updateStageStatus={updateStageStatus} ref={webcamRef} />
        </div>

        <Button
          onClick={handleRecognitionButtonClicked}
          disabled={stages[1].status === "loading" || stages[1].status === "successful"}
          variant={"outline"}
          className="text-center w-full bg-secondary-100 text-foreground"
        >
          {getFacialRecognitionButtonText()}
        </Button>

        <Button
          disabled={stages[1].status !== "successful"}
          onClick={() => {
            router.push("/communication_method_selection")
          }}
          className="w-full"
        >
          Test Microphone
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

export default Home