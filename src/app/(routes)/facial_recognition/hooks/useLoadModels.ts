import { useState, useEffect } from 'react';
import * as faceapi from 'face-api.js';

const useLoadModels = () => {
    const [modelsLoaded, setModelsLoaded] = useState(false);

    useEffect(() => {
        const loadModels = async () => {
            const MODEL_URL = 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights';
            await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
            await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
            await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
            setModelsLoaded(true);
        };

        loadModels();
    }, []);

    return modelsLoaded;
};

export default useLoadModels;