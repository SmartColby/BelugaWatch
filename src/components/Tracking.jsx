import React, { useEffect, useRef } from "react";

const Tracking = ({ videoUrl, trackingData = [] }) => {
  const canvasRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const video = videoRef.current;

    const drawFrame = () => {
      if (video.paused || video.ended) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Draw bounding boxes
      trackingData.forEach(({ X1, Y1, X2, Y2, Class, Track_ID }) => {
        ctx.strokeStyle = Class === "Adult" ? "green" : "blue";
        ctx.lineWidth = 2;
        ctx.strokeRect(X1, Y1, X2 - X1, Y2 - Y1);
        ctx.fillStyle = "white";
        ctx.fillText(`ID: ${Track_ID}`, X1, Y1 - 5);
      });

      requestAnimationFrame(drawFrame);
    };

    video.addEventListener("play", drawFrame);
    return () => video.removeEventListener("play", drawFrame);
  }, [trackingData]);

  return (
    <div style={{ position: "relative" }}>
      <video ref={videoRef} src={videoUrl} controls style={{ width: "100%" }} />
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      />
    </div>
  );
};

export default Tracking;