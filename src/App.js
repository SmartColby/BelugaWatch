import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/Home';
import SearchPage from './pages/SearchPage';
import TrackingPage from './pages/BelugaTracking';
import AboutUsPage from './pages/AboutUs';
import DiscussionFormPage from './pages/DiscussionFormPage';
import SignUpPage from './pages/SignUpPage'; 
import LoginPage from './pages/LoginPage'; 
import Education from './pages/Education'; 
import ContactPage from './pages/Contact'; // Import the ContactPage component

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Sending GET request to the backend API
    axios
      .get('/api') // Make sure your proxy is set up correctly for localhost
      .then((response) => {
        console.log('Backend Response:', response.data.message); // Log the backend response in the console
      })
      .catch((error) => {
        console.error('Error fetching data:', error); // Log any errors to the console
      });

    // Example: Check if the user is logged in
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []); // The empty dependency array ensures this runs only once on mount

  return (
    <Router>
      <div>
        {/* Navbar is included */}
        <Navbar />

        {/* Define Routes */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/tracking" element={<TrackingPage />} />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/discussion" element={<DiscussionFormPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/education" element={<Education />} />
          <Route path="/contact" element={<ContactPage />} /> {/* Added ContactPage route */}
          <Route path="*" element={<h2>404 Not Found</h2>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
