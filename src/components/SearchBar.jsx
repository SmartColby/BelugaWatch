import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/SearchBar.css';

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate(); // Hook for navigation

  // Preprocess query by removing unnecessary words (e.g., "Why", "How", "What")
  const preprocessQuery = (query) => {
    return query.replace(/\b(why|how|what|does|is|are|can|could|should)\b/gi, '').trim();
  };

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const cleanedQuery = preprocessQuery(searchQuery); // Preprocess the query
    navigate(`/search?query=${encodeURIComponent(cleanedQuery)}`); // Redirect to SearchPage with the query
  };

  const handleHover = () => setIsExpanded(true);
  const handleLeave = () => {
    if (!searchQuery) {
      setIsExpanded(false); // Contract the button if no search query
    }
  };

  const handleFocus = () => setIsExpanded(true);
  const handleBlur = () => {
    if (!searchQuery) {
      setIsExpanded(false); // Contract if no search query
    }
  };

  return (
    <div className="search-bar-container">
      <button
        type="button"
        className={`search-button ${isExpanded ? 'expanded' : ''}`}
        aria-label="Search"
        onMouseEnter={handleHover}
        onMouseLeave={handleLeave}
      >
        <span className="search-button-icon">🔍</span>

        <form onSubmit={handleSubmit} className="search-form">
          <input
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            className="search-input"
            placeholder="Search"
            aria-label="Search"
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        </form>
      </button>
    </div>
  );
};

export default SearchBar;
