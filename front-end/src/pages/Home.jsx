import React, { useEffect, useState } from "react";
import axios from "axios";
import HeroSection from "../components/HeroSection.jsx";
import KeyFeatures from "../components/KeyFeatures.jsx";
import WhaleSightings from "../components/WhaleSightings.jsx";
import WhaleTrackingMap from "../components/WhaleTrackingMap.jsx";
import EducationSection from "../components/EducationSection.jsx";
import CTA from "../components/CTA.jsx";
import "../styles/Home.css";

const HomePage = () => {
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    axios.get("/api") // ⬅️ No need for "http://localhost:5000" if using a proxy
      .then((response) => setMessage(response.data.message))
      .catch((error) => {
        console.error("Error fetching data:", error);
        setMessage("Failed to connect to backend.");
      });
  }, []);
  

  return (
    <div className="homepage">
      <h2>Backend Response: {message}</h2>
      <HeroSection />
      <KeyFeatures />
      <WhaleSightings />
      <WhaleTrackingMap />
      <EducationSection />
      <CTA />
    </div>
  );
};

export default HomePage;
