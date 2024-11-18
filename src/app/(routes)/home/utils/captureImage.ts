export const captureImage = (videoElement: HTMLVideoElement, canvasElement: HTMLCanvasElement): string | null => {
  const context = canvasElement.getContext("2d");
  if (context) {
    canvasElement.width = videoElement.videoWidth;
    canvasElement.height = videoElement.videoHeight;
    context.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
    return canvasElement.toDataURL("image/png");
  }
  return null;
};