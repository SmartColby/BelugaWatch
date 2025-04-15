import React, { useState } from "react";
import VideoUpload from "../components/VideoUpload";
import Tracking from "../components/Tracking";

const BelugaTracker = () => {
  const [trackingData, setTrackingData] = useState([]); // Default to an empty array
  const [videoUrl, setVideoUrl] = useState(""); // Default to an empty string

  const handleTrackingData = (data) => {
    setTrackingData(data || []); // Ensure data is always an array
    setVideoUrl(`http://localhost:5000/Beluga_Tracking/tracking_results/beluga_whales_tracked.mp4`);
  };

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <h1 className="text-4xl font-bold text-center mb-8">Beluga Whale Tracker</h1>
      <VideoUpload onTrackingData={handleTrackingData} />
      {videoUrl && trackingData.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Tracking Results</h2>
          <Tracking videoUrl={videoUrl} trackingData={trackingData} />
        </div>
      )}
    </div>
  );
};

export default BelugaTracker;