import React, { useState } from 'react';
import axios from 'axios';

const ImageDetection = () => {
  const [image, setImage] = useState(null);
  const [detectedObjects, setDetectedObjects] = useState([]);
  const [loading, setLoading] = useState(false);

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      setDetectedObjects([]);
    }
  };

  // Convert image to base64
  const convertImageToBase64 = (imageFile) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(imageFile);
    });
  };

  // Handle image detection
  const handleImageDetection = async () => {
    if (!image) {
      alert('Please select an image first.');
      return;
    }

    setLoading(true);
    try {
      const base64Image = await convertImageToBase64(image);
      const response = await axios.post('http://localhost:5000/api/detect', { image: base64Image });
      setDetectedObjects(response.data.detectedObjects);
    } catch (error) {
      console.error('Error during detection:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Beluga Whale Detection</h2>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      <button onClick={handleImageDetection} disabled={loading}>
        {loading ? 'Processing...' : 'Detect Objects'}
      </button>
      {image && (
        <div>
          <img src={image} alt="Selected" style={{ width: '100%', maxWidth: '500px' }} />
          <div>
            {detectedObjects.length > 0 ? (
              detectedObjects.map((obj, index) => (
                <div key={index}>
                  <p>Label: {obj.label}</p>
                  <p>Confidence: {obj.confidence}</p>
                  <p>Bounding Box: {JSON.stringify(obj.boundingBox)}</p>
                </div>
              ))
            ) : (
              <p>No objects detected.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageDetection;
