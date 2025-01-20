import { useEffect, useState, useRef } from 'react';
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
    const [boundingBox, setBoundingBox] = useState({});
    const imageRef = useRef(null);
    const highlightRef = useRef(null);


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
             setDetectionResults(
                 {
                     detected: `${detectionResults.detections[0].categories[0].categoryName}`,
                     confidence: `${(detectionResults.detections[0].categories[0].score * 100).toFixed(2)}`
                 }
            )
            setBoundingBox(detectionResults.detections[0].boundingBox)
        } catch (err) {
            console.log('Error during detection: ', err)
        }
    }

    useEffect(() => {
        if (highlightRef.current && boundingBox && Object.keys(boundingBox).length > 0 && imageRef.current) {
            const ratio = imageRef.current.height / imageRef.current.naturalHeight;
            highlightRef.current.style.left = boundingBox.originX * ratio + 'px';
            highlightRef.current.style.top = boundingBox.originY * ratio + 'px';
            highlightRef.current.style.width = boundingBox.width * ratio + 'px';
            highlightRef.current.style.height = boundingBox.height * ratio + 'px';
        }

    }, [boundingBox])

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
                <div id='top-half' className='h-80 flex flex-col'>
                    <div className='img-container relative flex justify-center max-w-full'>
                        {uploadedImage ? (
                            <div className='img-container relative flex justify-center max-w-full'>
                                <img ref={imageRef} src={img} alt='Uploaded by user' className='min-h-64 max-h-64'/>
                                {boundingBox.originX ? 
                                    <div className='highlighter absolute' ref={highlightRef}></div>
                                : null}
                            </div>
                        ) : null}
                    </div>
                    <form onSubmit={(e) => identifyImage(e)} className='mt-auto'>
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