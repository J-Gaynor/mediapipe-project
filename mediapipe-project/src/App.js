import { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [uploadedImage, setUploadedImage] = useState(false);

    const setImage = async(e) => {
        e.preventDefault();
        const buttonPressed = e.nativeEvent.submitter.value;
        if (buttonPressed === 'upload') {
            setUploadedImage(true);
        } else {
            console.log(process.env.REACT_APP_BACKEND_URL)
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}`, {
                image: 'image'
            })
            console.log(response);
        }
    }

    return (
        <div className='App'>
            <main>
                <div id='top-half'>
                    <div id='img-container'>
                        {!uploadedImage ? 
                            <img src={null}/>
                        :
                            <img src={null}/>
                        }
                    </div>
                </div>
                <div id='bottom-half'>
                    <form onSubmit={(e) => setImage(e)}>
                        <button value='upload'>Upload</button>
                        <button value='identify'>Identify</button>
                    </form>
                </div>
            </main>
        </div>
    );
}

export default App;
