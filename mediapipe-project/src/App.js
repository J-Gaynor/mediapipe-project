import { useEffect, useState, useRef, use } from 'react';
import './App.css';
import {
    ObjectDetector,
    FilesetResolver,
} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.2";

function App() {
    const [uploadedImage, setUploadedImage] = useState(false);
    const [img, setImg] = useState(null);
    const [objectDetector, setObjectDetector] = useState(null);
    const [detectionResults, setDetectionResults] = useState({});
    const imageRef = useRef(null);


    useEffect(() => {
        const createObjectDetector = async() => {
            try {
                const vision = await FilesetResolver.forVisionTasks('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.2/wasm');
                const detector = await ObjectDetector.createFromOptions(vision, {
                    baseOptions: {
                        modelAssetPath: `https://storage.googleapis.com/mediapipe-models/object_detector/efficientdet_lite0/float16/1/efficientdet_lite0.tflite`,
                        delegate: 'GPU'
                    },
                    scoreThreshold: 0.5,
                    runningMode: 'IMAGE'
                });
                setObjectDetector(detector);
            } catch (err) {
                console.log('Error loading mediapipe: ', err);
            }
        };

        createObjectDetector();
    }, [])

    const identifyImage = async(e) => {
        e.preventDefault();
        if (!uploadedImage) {
            alert('Image required');
            return;
        }

         if (!objectDetector) {
             alert("Object detector still loading");
             return;
         }

        try {
            const detectionResults = objectDetector.detect(imageRef.current);
            console.log(detectionResults.detections[0].categories[0].categoryName)
            setDetectionResults(
                {
                    detected: `${detectionResults.detections[0].categories[0].categoryName}`,
                    confidence: `${Math.round(detectionResults.detections[0].categories[0].score * 100)}`
                }
            )
        } catch (err) {
            console.log('Error during detection: ', err)
        }
    }

    useEffect(() => {
        console.log(detectionResults)
    }, [detectionResults])

    const uploadImg = e => {
        setUploadedImage(true);
        const file = e.target.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImg(reader.result)
            };
            reader.readAsDataURL(file);
        }
    }

    return (
        <div className='App'>
            <main className='grid'>
                <div id='top-half' className='h-80'>
                    <div id='img-container flex'>
                        {uploadedImage ? (
                            <img ref={imageRef} src={img} alt='Uploaded by user' className='min-h-72 max-h-72 mx-auto'/>
                        ) : (
                            null
                        )}
                    </div>
                    <form onSubmit={(e) => identifyImage(e)} className='mt-8'>
                        <input type='file' onChange={(e) => uploadImg(e)} accept='image/*'/>
                        <button disabled={!uploadedImage} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>Identify</button>
                    </form>
                </div>
                <div id='bottom-half' className='my-40'>
                    <div id='results'>
                        {detectionResults ? (
                            <div>
                                <h1>Detected: <span>{detectionResults.detected}</span></h1>
                                <h1>Confidence: <span>{detectionResults.confidence }%</span></h1>
                            </div>
                        ) : (
                            null
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

export default App;