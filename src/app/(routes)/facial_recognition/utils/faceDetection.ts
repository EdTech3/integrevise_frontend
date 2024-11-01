import * as faceapi from 'face-api.js';

export const detectFaces = async (imageElement: HTMLImageElement) => {
  return await faceapi.detectAllFaces(imageElement).withFaceLandmarks().withFaceDescriptors();
};

export const compareFaces = (descriptor1: Float32Array, descriptor2: Float32Array) => {
  return faceapi.euclideanDistance(descriptor1, descriptor2);
};