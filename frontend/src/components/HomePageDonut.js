import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title
} from 'chart.js';

import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

function HomePageDonut() {

    const data = {
    labels: ['Protein', 'Fat', 'Carbohydrates'],
    datasets: [
      {
        //label: 'Грамів',
        data: [100, 140, 210], 
        backgroundColor: [
          'rgba(11, 184, 203, 0.6)',
          '#d4a20b',
          '#268bd2',
        ],
        borderColor: 'white',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#ffffff',
          font: { size: 18}
        },
      },
    },
    cutout: '0%',
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto' }}>
      <h3 style={{ color: 'rgb(255, 255, 255)', textAlign: 'center' }}>Nutrition Statistics</h3>
      <Doughnut data={data} options={options} />
    </div>
  );
}

export default HomePageDonut