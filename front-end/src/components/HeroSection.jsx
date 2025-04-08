import React, { useState, useEffect } from 'react';
import '../styles/HeroSection.css'; 

const belugaImages = [
    './images/beluga1.jpg',
    './images/beluga2.jpg',
    './images/beluga3.jpg',
    './images/beluga4.jpg',
  ];
  

const HeroSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Preload images
    const img = new Image();
    img.src = belugaImages[currentIndex];
    img.onload = () => setLoading(false);

    // Start automatic slideshow
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  const nextSlide = () => {
    setLoading(true);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % belugaImages.length);
  };

  const prevSlide = () => {
    setLoading(true);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + belugaImages.length) % belugaImages.length);
  };

  return (
    <section className="hero" style={{ backgroundImage: `url(${belugaImages[currentIndex]})` }}>
      {loading && <div className="loading-spinner"></div>}
      
      <div className="hero-content">
        <h1>Protect & Track Beluga Whales</h1>
        <p>Join the mission to conserve and learn more about these magnificent creatures.</p>
        <button className="hero-button">Explore More</button>
      </div>

      {/* Navigation Arrows */}
      <button className="arrow left-arrow" onClick={prevSlide}>&#10094;</button>
      <button className="arrow right-arrow" onClick={nextSlide}>&#10095;</button>

      {/* Dots for Slide Indicators */}
      <div className="dots-container">
        {belugaImages.map((_, index) => (
          <span 
            key={index} 
            className={`dot ${index === currentIndex ? 'active' : ''}`} 
            onClick={() => setCurrentIndex(index)}
          ></span>
        ))}
      </div>
    </section>
  );
};

export default HeroSection;

