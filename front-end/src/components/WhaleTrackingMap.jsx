import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import '../styles/WhaleTrackingMap.css';
import 'leaflet/dist/leaflet.css';
import demoVideo from '../assets/tracked_20250406_233326.mp4'; // Import the video file

// Fix for missing marker icons in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const WhaleTrackingMap = () => {
  const [sightings, setSightings] = useState([]);

  useEffect(() => {
    const fetchSightings = async () => {
      try {
        const res = await fetch(
          'https://api.gbif.org/v1/occurrence/search?scientificName=Delphinapterus+leucas&hasCoordinate=true&limit=100'
        );
        const data = await res.json();
        const points = data.results.map((item) => ({
          id: item.key,
          lat: item.decimalLatitude,
          lon: item.decimalLongitude,
          date: item.eventDate ? new Date(item.eventDate).toDateString() : 'Unknown date',
          location: item.locality || item.country || 'Unknown location',
        }));
        setSightings(points);
      } catch (err) {
        console.error('Error fetching GBIF data:', err);
      }
    };

    fetchSightings();
  }, []);

  return (
    <section className="tracking-map">
      <h2>Beluga Whale Tracking</h2>
      <p>View our interactive map to follow whale movements, or watch the demo video below to see the power of our tracking and annotation system in action.</p>
      
      <div className="video-container">
        <video width="100%" controls autoPlay muted>
          <source src={demoVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Interactive Leaflet Map */}
      <MapContainer center={[60, -150]} zoom={3} style={{ height: '500px', width: '100%', marginTop: '1rem' }}>
        <TileLayer
          attribution='&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {sightings.map((sighting) => (
          <Marker key={sighting.id} position={[sighting.lat, sighting.lon]}>
            <Popup>
              <strong>Beluga Sighting</strong><br />
              {sighting.location}<br />
              {sighting.date}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </section>
  );
};

export default WhaleTrackingMap;
