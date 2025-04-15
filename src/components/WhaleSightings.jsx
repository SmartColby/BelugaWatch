import React, { useEffect, useState } from 'react';
import '../styles/WhaleSightings.css';

const WhaleSightings = () => {
  const [sightings, setSightings] = useState([]);

  useEffect(() => {
    const fetchSightings = async () => {
      try {
        const response = await fetch(
          'https://api.gbif.org/v1/occurrence/search?scientificName=Delphinapterus+leucas&hasCoordinate=true&limit=10'
        );
        const data = await response.json();
        const formattedSightings = data.results.map((item) => ({
          id: item.key,
          location: item.locality || item.country || 'Unknown location',
          date: item.eventDate ? new Date(item.eventDate).toDateString() : 'Unknown date',
          sourceUrl: `https://www.gbif.org/occurrence/${item.key}`, // Link to GBIF occurrence
        }));
        setSightings(formattedSightings);
      } catch (error) {
        console.error('Failed to fetch whale sightings:', error);
      }
    };

    fetchSightings();
  }, []);

  return (
    <section className="sightings">
      <h2>Latest Whale Sightings</h2>
      <div className="sightings-list">
        {sightings.length === 0 ? (
          <p>Loading recent sightings...</p>
        ) : (
          sightings.map((sighting) => (
            <p key={sighting.id}>
              🐋 Beluga spotted near {sighting.location} ({sighting.date}) -{' '}
              <a
                href={sighting.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="source-link"
              >
                View Source
              </a>
            </p>
          ))
        )}
      </div>
    </section>
  );
};

export default WhaleSightings;
