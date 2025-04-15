import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom'; // Hook to get the search query from the URL
import axios from 'axios';
import '../styles/SearchPage.css'; // Make sure to add styling

const SearchPage = () => {
  const [searchResults, setSearchResults] = useState([]); // State to store the search results
  const [query, setQuery] = useState(''); // State to store the search query
  const [loading, setLoading] = useState(false); // State for loading
  const [error, setError] = useState(null); // State for errors
  const location = useLocation(); // Hook to get current URL and query params

  // This effect will run when the component mounts and when the query changes
  useEffect(() => {
    // Get the query parameter from the URL (e.g. ?query=beluga)
    const urlParams = new URLSearchParams(location.search);
    const searchQuery = urlParams.get('query');
    setQuery(searchQuery); // Update the query state

    if (searchQuery) {
      // Fetch the search results based on the query from the backend or API
      handleSearchBackend(searchQuery);
    }
  }, [location.search]); // Dependency on location.search to trigger effect on query change

  // Function to handle search request (use POST for your actual backend)
  const handleSearchBackend = async (query) => {
    setLoading(true);
    setError(null); // Reset error state before making a new request
    try {
      // Sending a POST request with the search query to the backend
      const response = await axios.post('http://localhost:5000/api/search', { query });
      setSearchResults([response.data]); // Wrap result in an array to match the rendering logic
    } catch (error) {
      console.error('Error fetching search results:', error);
      setError('Sorry, there was an error fetching the search results. Please try again later.');
    } finally {
      setLoading(false); // Reset loading state once the request completes
    }
  };

  return (
    <div className="search-page">
      <h1>Search Results for: "{query}"</h1>

      {/* Display loading state */}
      {loading && <p>Loading...</p>}

      {/* Display error message */}
      {error && <p className="error-message">{error}</p>}

      {/* Display search results */}
      <div className="results-container">
        {searchResults.length > 0 ? (
          searchResults.map((result, index) => (
            <div key={index} className="search-result">
              <h2>{result.title}</h2>
              <p>{result.summary}</p>
              <a href={result.url} target="_blank" rel="noopener noreferrer">Read more</a>
            </div>
          ))
        ) : (
          <p>No results found for "{query}".</p>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
