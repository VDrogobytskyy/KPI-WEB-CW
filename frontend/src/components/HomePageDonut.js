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

function HomePageDonut({ variant = 'dark' }) {
  const isDark = variant === 'dark'
  const labelColor = isDark ? 'rgba(255,255,255,0.88)' : 'rgba(0,0,0,0.72)'

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
        borderColor: isDark ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.10)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: labelColor,
          font: { size: 18}
        },
      },
    },
    cutout: '0%',
  };

  return (
    <div className="chart-block">
      <div className="chart-block-head chart-block-head--center">
        <h3 className={`chart-title ${isDark ? 'chart-title--dark' : 'chart-title--light'}`}>Nutrition statistics</h3>
      </div>
      <div className="chart-canvas chart-canvas--donut">
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
}

export default HomePageDonut
