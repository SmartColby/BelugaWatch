import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const BelugaChart = ({ populationData }) => {
  if (!populationData || populationData.length === 0) {
    return <p>No population data available.</p>;
  }

  const initialPopulation = populationData[0].estimate;
  const finalPopulation = populationData[populationData.length - 1].estimate;
  const declinePercentage = (((initialPopulation - finalPopulation) / initialPopulation) * 100).toFixed(2);

  const data = {
    labels: populationData.map((point) => point.year),
    datasets: [
      {
        label: 'Population Estimate',
        data: populationData.map((point) => point.estimate),
        borderColor: '#004d40', // Dark teal for the line
        backgroundColor: 'rgba(0, 77, 64, 0.2)', // Light teal fill
        borderWidth: 2, // Thinner line
        pointRadius: 3, // Smaller points
        pointBackgroundColor: '#ff5722', // Bright orange for points
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Allow the chart to fill the container
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#333', // Dark grey for legend text
          font: {
            size: 12, // Smaller font size for legend
          },
        },
      },
      title: {
        display: true,
        text: 'Beluga Whale Population Trends (Cook Inlet)',
        color: '#333', // Dark grey for title
        font: {
          size: 14, // Smaller font size for title
          weight: 'bold',
        },
        padding: {
          top: 5,
          bottom: 5,
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => `Population: ${context.raw} individuals`,
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Year',
          color: '#333', // Dark grey for axis title
          font: {
            size: 12,
            weight: 'bold',
          },
        },
        ticks: {
          color: '#333', // Dark grey for axis labels
          font: {
            size: 10,
          },
        },
        grid: {
          color: '#eee', // Light grey gridlines
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Population Estimate',
          color: '#333', // Dark grey for axis title
          font: {
            size: 12,
            weight: 'bold',
          },
        },
        ticks: {
          color: '#333', // Dark grey for axis labels
          font: {
            size: 10,
          },
        },
        grid: {
          color: '#eee', // Light grey gridlines
        },
      },
    },
  };

  return (
    <div className="beluga-chart-container">
      <h3>Population Trends</h3>
      <div style={{ height: '200px', width: '100%' }}> {/* Reduced height */}
        <Line data={data} options={options} />
      </div>
      <p className="beluga-chart-description">
        The Cook Inlet beluga whale population has experienced a significant decline of <strong>{declinePercentage}%</strong> 
        from {initialPopulation} individuals in {populationData[0].year} to {finalPopulation} individuals in {populationData[populationData.length - 1].year}.
        This decline highlights the urgent need for conservation efforts to protect this endangered population.
      </p>
    </div>
  );
};

export default BelugaChart;
