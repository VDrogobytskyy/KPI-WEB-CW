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
import { Line } from 'react-chartjs-2';

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

function HomePageCalories({ variant = 'dark' }) {
    const isDark = variant === 'dark'
    const tickColor = isDark ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.75)'
    const gridColor = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.10)'
    const lineColor = isDark ? 'rgba(255,255,255,0.92)' : 'rgba(0,0,0,0.75)'
    const fillColor = isDark ? 'rgba(11, 184, 203, 0.35)' : 'rgba(11, 184, 203, 0.25)'

    const lineData = {
        labels: ['March', 'April', 'May', 'June', 'July'],
        datasets: [
            {
                // label: 'Calories burned',
                data: [18000, 22000, 13000, 17500, 36000],
                borderColor: lineColor,
                backgroundColor: fillColor,
                tension: 0.3,
                pointRadius: 3,
                pointHoverRadius: 5,
                fill: true,
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
                <h3 className={`chart-title ${isDark ? 'chart-title--dark' : 'chart-title--light'}`}>
                    Calorie burning dynamic
                </h3>
            </div>
            <div className="chart-canvas">
                <Line data={lineData} options={options} />
            </div>
        </div>
    );
}

export default HomePageCalories
