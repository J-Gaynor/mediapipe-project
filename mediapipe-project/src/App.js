import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [uploadedImage, setUploadedImage] = useState(false);
    const [img, setImg] = useState(null)

    const identifyImage = async() => {
        console.log(process.env.REACT_APP_BACKEND_URL)
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}`, {
            image: 'image'
        })
        console.log(response);
    }

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

    useEffect(() => {
        console.log(img)
    }, [img])

    return (
        <div className='App'>
            <main className='grid'>
                <div id='top-half' className=''>
                    <div id='img-container flex'>
                        <img src={img} className='max-w-80 mx-auto'/>
                    </div>
                </div>
                <div id='bottom-half' className=''>
                    <form onSubmit={(e) => identifyImage(e)}>
                        <input type='file' onChange={(e) => uploadImg(e)} accept='image/*'/>
                        <button value='identify' disabled={setUploadedImage}>Identify</button>
                    </form>
                </div>
            </main>
        </div>
    );
}

export default App;
