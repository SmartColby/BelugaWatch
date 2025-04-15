import React, { useEffect, useState } from 'react';
import BelugaChart from '../components/BelugaChart';
import '../styles/DiscussionFormPage.css';

const DiscussionFormPage = () => {
  const [belugaData, setBelugaData] = useState(null);

  useEffect(() => {
    const fetchBelugaData = async () => {
      try {
        const speciesRes = await fetch("http://localhost:5000/api/beluga-species");
        const species = await speciesRes.json();

        const threatsRes = await fetch("http://localhost:5000/api/beluga-threats");
        const threats = await threatsRes.json();

        const habitatsRes = await fetch("http://localhost:5000/api/beluga-habitats");
        const habitats = await habitatsRes.json();

        const populationTrendsRes = await fetch("http://localhost:5000/api/beluga-population-trends");
        const populationTrends = await populationTrendsRes.json();

        const conservationActionsRes = await fetch("http://localhost:5000/api/beluga-conservation-actions");
        const conservationActions = await conservationActionsRes.json();

        setBelugaData({
          species,
          threats,
          habitats,
          populationTrends,
          conservationActions,
        });
      } catch (err) {
        console.error("Error fetching Beluga data:", err);
      }
    };

    fetchBelugaData();
  }, []);

  if (!belugaData) {
    return <p>Loading Beluga Whale data...</p>;
  }

  return (
    <div className="dfp-discussion-form-page">
      <header className="dfp-discussion-form-page__header">
        <h1>Beluga Whale Conservation Dashboard</h1>
        <p>Explore data and insights about beluga whales, their habitats, threats, and conservation efforts.</p>
      </header>

      {/* General Information */}
      <section className="dfp-section">
        <h2>General Information</h2>
        <p><strong>Scientific Name:</strong> {belugaData.species?.taxon?.scientific_name?.[0] || "Data not available"}</p>
        <p><strong>Conservation Status:</strong> {belugaData.species?.red_list_category?.description?.en?.[0] || "Data not available"}</p>
        <p><strong>Interesting Facts:</strong> Beluga Whales are known as the "canaries of the sea" due to their wide range of vocalizations.</p>
      </section>

      {/* Population Trends */}
      <section className="dfp-section">
        <h2>Population Trends</h2>
        {belugaData.populationTrends && belugaData.populationTrends.population_data ? (
          <BelugaChart populationData={belugaData.populationTrends.population_data.data_points} />
        ) : (
          <p>No population trends data available.</p>
        )}
      </section>

      {/* Threats */}
      <section className="dfp-section dfp-threats">
        <h2><i className="fas fa-exclamation-triangle"></i> Threats</h2>
        {belugaData.threats?.threats?.length > 0 ? (
          <ul>
            {belugaData.threats.threats.map((threat, index) => (
              <li key={index}>
                <strong>{threat.description.en}</strong>
              </li>
            ))}
          </ul>
        ) : (
          <p>No threats data available.</p>
        )}
      </section>

      {/* Habitats */}
      <section className="dfp-section">
        <h2>Habitats</h2>
        {belugaData.habitats?.beluga_whale_habitats?.length > 0 ? (
          <ul>
            {belugaData.habitats.beluga_whale_habitats.map((habitat, index) => (
              <li key={index}>
                <strong>{habitat.location}</strong> - {habitat.why_important}
                <ul>
                  {habitat.scientific_reasons.map((reason, i) => (
                    <li key={i}>{reason}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        ) : (
          <p>No habitats data available.</p>
        )}
      </section>

      {/* Conservation Actions */}
      <section className="dfp-section dfp-conservation-actions">
        <h2>Conservation Actions</h2>
        {belugaData.conservationActions?.beluga_whale_conservation?.length > 0 ? (
          <ul>
            {belugaData.conservationActions.beluga_whale_conservation.map((action, index) => (
              <li key={index}>
                <strong>{action.date}:</strong> {action.description.en} (<em>{action.agency}</em>)
                <p><strong>Policy:</strong> {action.policy}</p>
                <p><strong>Note:</strong> {action.note}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No conservation actions data available.</p>
        )}
      </section>
    </div>
  );
};

export default DiscussionFormPage;
