import React, { useState } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [imageSrc, setImageSrc] = useState(null);
  const [results, setResults] = useState([]);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const capture = async () => {
    setLoading(true); // Set loading state to true

    const imageSrc = webcamRef.current.getScreenshot();
    const backendEndpoint = 'https://avantskincare.co.uk/upload-image/';

    try {
      const formData = new FormData();
      formData.append('file', dataURItoBlob(imageSrc));

      const response = await axios.post(backendEndpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        responseType: 'json',
      });

      const imageResponse = response.data.output;
      setImageSrc(imageResponse);
      setResults(response.data.results);
      setRecommendedProducts(response.data.recommendations);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); // Set loading state to false when done processing
    }
  };

  const dataURItoBlob = (dataURI) => {
    const byteString = atob(dataURI.split(',')[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: 'image/jpeg' });
  };

  const webcamRef = React.createRef();

  return (
    <div className="app-container">
      <div className="container mt-4">
        <div className="row">
          <div className="col-lg-6">
            <Webcam
              audio={false}
              height={300}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              width={400}
            />
          </div>
          <div className="col-lg-6">
            {loading ? ( // Show loader while loading is true
              <div className="loader">Loading...</div>
            ) : (
              <div>
                {imageSrc && (
                  <div className="captured-image-container">
                    <img src={`data:image/png;base64,` + imageSrc} alt="Captured Selfie" style={{ width: "400px", height: "300px" }} />
                  </div>
                )}
              </div>
            )}
            <button className="btn btn-primary mt-3" onClick={capture}>
              Capture
            </button>
          </div>
        </div>
      </div>

      {/* Display the results and recommended products */}
      <div className="results-container mt-4">
        <h2>Results:</h2>
        <ul>
          {results.map((result, index) => (
            <li key={index}>
              {result.model_name}: {result.percentage}
            </li>
          ))}
        </ul>
      </div>

      <div className="recommendations-container mt-4">
        <h2>Recommended Products:</h2>
        <ul>
          {recommendedProducts.map((product, index) => (
            <li key={index}>{product}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
