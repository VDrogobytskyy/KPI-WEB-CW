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
import { Bar } from 'react-chartjs-2';
import { useI18n } from '../i18n'

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
    
function HomePageActivity({ variant = 'light' }){
    const { t } = useI18n()
    const isDark = variant === 'dark'
    const tickColor = isDark ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.72)'
    const gridColor = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.10)'

    const barData = {
    labels: t('chartMonths'),
    datasets: [
      {
        // label: 'Рівень складності тем',
        data: [4, 7, 1, 17, 19],
        backgroundColor: 'rgba(11, 184, 203, 0.6)',
        borderRadius: 10,
      },
    ],
  };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
        legend: {
            display: false,
            labels: {
            color: tickColor, 
            },
        },
        },
        scales: {
        x: {
            ticks: {
            color: tickColor,
            },
            grid: { color: gridColor },
        },
        y: {
            ticks: {
            color: tickColor, 
            },
            grid: { color: gridColor },
        },
        },
    };
    return (
      <div className="chart-block">
        <div className="chart-block-head">
          <h3 className={`chart-title ${isDark ? 'chart-title--dark' : 'chart-title--light'}`}>{t('trainingActivity')}</h3>
        </div>
        <div className="chart-canvas">
          <Bar data={barData} options={options} />
        </div>
      </div>
    );
}

export default HomePageActivity
