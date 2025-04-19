import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/VideoUpload.css";

export default function VideoUpload() {
  const [videoFile, setVideoFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [originalVideoUrl, setOriginalVideoUrl] = useState(null);
  const [trackingVideoUrl, setTrackingVideoUrl] = useState(null);
  const [trackingDataUrl, setTrackingDataUrl] = useState(null);
  const [progress, setProgress] = useState(null); // Progress state

  const handleFileChange = (event) => {
    setVideoFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!videoFile) return alert("Please select a video file to upload.");
    setUploading(true);

    const formData = new FormData();
    formData.append("video", videoFile);

    try {
      // Upload video
      const uploadResponse = await axios.post("http://localhost:5000/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const uploadedVideoPath = uploadResponse.data.filePath;
      setOriginalVideoUrl(`http://localhost:5000${uploadedVideoPath}`);
      console.log("Original Video URL:", `http://localhost:5000${uploadedVideoPath}`);

      // Open WebSocket connection for progress updates
      const ws = new WebSocket("ws://localhost:5000/progress");
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("Progress update received:", data); // Debugging log
        setProgress(data); // Update progress state
      };

      // Process video for tracking
      const trackingResponse = await axios.post("http://localhost:5000/api/process-tracking", {
        videoPath: uploadedVideoPath,
      });

      if (!trackingResponse.data.trackingVideoPath || !trackingResponse.data.trackingDataPath) {
        console.error("Tracking video or data path not returned by backend.");
        alert("Failed to retrieve tracking video or data. Please try again.");
        return;
      }

      const trackingVideoPath = trackingResponse.data.trackingVideoPath;
      const trackingDataPath = trackingResponse.data.trackingDataPath;
      setTrackingVideoUrl(`http://localhost:5000${trackingVideoPath}`);
      setTrackingDataUrl(`http://localhost:5000${trackingDataPath}`);
      console.log("Tracking Video URL:", `http://localhost:5000${trackingVideoPath}`);
      console.log("Tracking Data URL:", `http://localhost:5000${trackingDataPath}`);
    } catch (error) {
      console.error("Error uploading or processing video:", error);
      alert("Failed to process video. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="video-upload-container">
      <div className="upload-section">
        <h2 className="title">Upload Your Beluga Whale Video</h2>
        <p className="subtitle">Share your video and watch it transform into something magical!</p>
        <input
          type="file"
          accept="video/*"
          onChange={handleFileChange}
          className="file-input"
        />
        <button
          onClick={handleUpload}
          disabled={uploading}
          className={`upload-button ${uploading ? "disabled" : ""}`}
        >
          {uploading ? "Uploading..." : "Upload and Process"}
        </button>
      </div>

      {progress && (
        <div className="progress-section">
          <h3>Processing Progress</h3>
          <p>
            Frame {progress.currentFrame} of {progress.totalFrames} (
            {progress.percentage.toFixed(2)}%)
          </p>
        </div>
      )}

      {originalVideoUrl && (
        <div className="video-display-section">
          <h3 className="section-title">Your Videos</h3>
          <div className="video-grid">
            <div className="video-card">
              <h4>Original Video</h4>
              <video controls src={originalVideoUrl} className="video-player" />
            </div>
            <div className="video-card">
              <h4>Tracking</h4>
              <video
                controls
                src={trackingVideoUrl}
                className="video-player"
                onError={(e) => console.error("Error loading video:", e.target.error)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}