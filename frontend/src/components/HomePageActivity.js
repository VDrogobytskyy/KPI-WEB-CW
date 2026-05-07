import React from 'react';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);
const bodyBg = getComputedStyle(document.documentElement)
    .getPropertyValue('--bs-body-bg').trim();
    
function HomePageActivity (){
    const barData = {
    labels: ['March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        // label: 'Рівень складності тем',
        data: [4, 7, 1, 17, 19],
        backgroundColor: 'rgba(11, 184, 203, 0.6)',
      },
    ],
  };

    const options = {
        responsive: true,
        plugins: {
        legend: {
            display: false,
            labels: {
            color: 'black', 
            },
        },
        },
        scales: {
        x: {
            ticks: {
            color: 'black',
            },
        },
        y: {
            ticks: {
            color: 'black', 
            },
        },
        },
    };
    return (
      <div style={{ width: '625px', color: 'black' }}>
        <h3>Training activity</h3>
        <Bar data={barData} options={options} /> 
      </div>
    );
}

export default HomePageActivity