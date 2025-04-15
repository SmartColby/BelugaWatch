import React, { useEffect, useState } from 'react';

const NewsFeed = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/news');
        const data = await response.json();

        if (Array.isArray(data)) {
          setArticles(data);
        } else {
          throw new Error('Invalid response format');
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching news:', err);
        setError('Failed to load news');
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return <p>Loading news...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!Array.isArray(articles)) {
    return <p>Failed to load news. Please try again later.</p>;
  }

  if (articles.length === 0) {
    return <p>No news articles available at the moment. Please check back later.</p>;
  }

  return (
    <div>
      <h1>Beluga Whale and Marine Life News</h1>
      {articles.map((article, index) => (
        <div key={index} style={{ marginBottom: '20px' }}>
          <h2>{article.title}</h2>
          <p>Source: {article.source}</p>
          <a href={article.link} target="_blank" rel="noopener noreferrer">
            Read more
          </a>
        </div>
      ))}
    </div>
  );
};

export default NewsFeed;
