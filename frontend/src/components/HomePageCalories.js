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

function HomePageCalories() {
    const lineData = {
        labels: ['March', 'April', 'May', 'June', 'July'],
        datasets: [
            {
                // label: 'Calories burned',
                data: [18000, 22000, 13000, 17500, 36000],
                borderColor: 'rgb(246, 246, 246)',
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                tension: 0.3,
                color: 'white',
            },
        ],
    };
    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
                labels: {
                    color: 'white',
                },
            },
        },
        scales: {
            x: {
                ticks: {
                    color: 'white',
                },
            },
            y: {
                ticks: {
                    color: 'white',
                },
            },
        },
    };
    return (
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', padding: '20px', color: 'white' }}>
            <div style={{ width: '450px', color: 'white' }}>
                <h3 style={{ color: 'white' }}>Calorie burning dynamic</h3>
                <Line data={lineData} options={options} />
            </div>
        </div>
    );
}

export default HomePageCalories