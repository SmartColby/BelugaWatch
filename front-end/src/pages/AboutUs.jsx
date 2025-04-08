import React, { useState } from 'react';
import BelugaGame from '../components/BelugaGame';
import '../styles/AboutUs.css';

// Team member data
const teamMembers = [
  {
    name: 'Antonio Artero',
    role: 'Real-Time Systems Developer',
    bio: 'Antonio is leading the development of real-time detection and tracking systems...',
    photo: '/images/alice_photo.jpg',
  },
  {
    name: 'Dawson Stage',
    role: 'Visualization Architect',
    bio: 'Dawson focuses on transforming complex datasets into visually engaging stories...',
    photo: '/images/bob_photo.jpg',
  },
  {
    name: 'Giovanni Colbert',
    role: 'Front-End Developer & UI/UX Designer',
    bio: 'Giovanni leads the creation of intuitive, user-friendly interfaces...',
    photo: '/images/carol_photo.jpg',
  },
];

const AboutUs = () => {
  const [gameVisible, setGameVisible] = useState(false);
  const [code, setCode] = useState('');

  // Handle secret code input
  const handleCodeInput = (e) => {
    setCode(e.target.value);
    if (e.target.value === 'beluga123') {
      setGameVisible(true);
    }
  };

  return (
    <section className="about-us">
      <h1>About Us</h1>
      <p className="intro">
        Welcome to our project dedicated to the majestic beluga whale. Our team combines expertise in marine biology, 
        graphic design, and web development to bring you an informative and engaging experience.
      </p>
      <div className="team">
        {teamMembers.map((member, index) => (
          <div className="team-member" key={index}>
            <img src={member.photo} alt={member.name} className="member-photo" />
            <h2>{member.name}</h2>
            <h3>{member.role}</h3>
            <p>{member.bio}</p>
          </div>
        ))}
      </div>

      {/* Beluga Whale Image */}
      <img src="/images/beluga5.jpg" alt="Beluga Whale" className="beluga-animation" />

      {/* Conditionally render the code input box */}
      {!gameVisible && (
        <input 
          type="text" 
          placeholder="Enter Code to Start Game..." 
          value={code} 
          onChange={handleCodeInput} 
        />
      )}

      {/* Conditionally render the game canvas */}
      {gameVisible && <BelugaGame />}
    </section>
  );
};

export default AboutUs;
