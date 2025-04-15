import React from 'react';
import '../styles/KeyFeatures.css';

const KeyFeatures = () => {
  return (
    <section className="features">
      <h2>Key Features</h2>
      <div className="feature-list">
        <div className="feature">
          <h3>Live Whale Tracking</h3>
          <p>Follow beluga whale movements in real time.</p>
        </div>
        <div className="feature">
          <h3>Community Reports</h3>
          <p>See and contribute whale sightings worldwide.</p>
        </div>
        <div className="feature">
          <h3>Educational Resources</h3>
          <p>Learn about conservation and beluga behavior.</p>
        </div>
      </div>
    </section>
  );
};

export default KeyFeatures;
