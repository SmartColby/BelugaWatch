import React from 'react';
import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';
import '../styles/Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/" aria-label="Home">
            <h1>Beluga Watch</h1>
          </Link>
        </div>

        <ul className="navbar-links">
          <li className="navbar-item"><Link to="/tracking">Whale Tracking</Link></li>
          <li className="navbar-item"><Link to="/discussion">Conservation</Link></li>
          <li className="navbar-item"><Link to="/education">Education</Link></li>
          <li className="navbar-item"><Link to="/about">About Us</Link></li>
          <li className="navbar-item"><Link to="/contact">Contact</Link></li> {/* Added Contact link */}
        </ul>

        <div className="navbar-auth">
          <Link to="/signup" className="auth-link">Sign Up</Link>
          <Link to="/login" className="auth-link">Login</Link>
        </div>

        <div className="navbar-search">
          <SearchBar />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
