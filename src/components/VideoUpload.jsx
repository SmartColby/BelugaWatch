import React, { useState } from "react";
import axios from "axios";
import "../styles/VideoUpload.css";

const VideoUpload = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [trackingVideoUrl, setTrackingVideoUrl] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingMessage, setProcessingMessage] = useState("");

  const handleUpload = async () => {
    if (!videoFile) return alert("Please select a video file to upload.");

    setIsProcessing(true); // Disable the button and show the loading indicator
    setProcessingMessage("Processing your video. Please wait...");

    const formData = new FormData();
    formData.append("video", videoFile);

    try {
      // Upload video and process it
      const response = await axios.post("http://localhost:5000/api/process-tracking", {
        videoPath: `/uploads/${videoFile.name}`, // Adjust path as needed
      });

      setTrackingVideoUrl(`http://localhost:5000${response.data.trackingVideoPath}`);
      setProcessingMessage("Your video is ready for download!");
    } catch (error) {
      console.error("Error processing video:", error);
      setProcessingMessage("Failed to process video. Please try again.");
    } finally {
      setIsProcessing(false); // Re-enable the button
    }
  };

  return (
    <div className="video-upload-container">
      <div className="upload-section">
        <h1 className="title">Upload Video</h1>
        <input
          type="file"
          accept="video/*"
          onChange={(e) => setVideoFile(e.target.files[0])}
          className="file-input"
          disabled={isProcessing} // Disable input while processing
        />
        <button
          onClick={handleUpload}
          className="upload-button"
          disabled={isProcessing}
        >
          {isProcessing ? "Processing..." : "Upload and Process"}
        </button>
      </div>

      {processingMessage && <p className="processing-message">{processingMessage}</p>}

      {trackingVideoUrl && (
        <div className="download-section">
          <h2 className="section-title">Your Tracked Video</h2>
          <a href={trackingVideoUrl} download className="download-link">
            Download Tracked Video
          </a>
        </div>
      )}
    </div>
  );
};

export default VideoUpload;