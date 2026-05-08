export const tickColorDark = 'rgba(255,255,255,0.85)'
export const gridColorDark = 'rgba(255,255,255,0.12)'

export const commonOptionsDark = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: { ticks: { color: tickColorDark }, grid: { color: gridColorDark } },
    y: { ticks: { color: tickColorDark }, grid: { color: gridColorDark } },
  },
}

export const donutOptionsDark = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: { color: 'rgba(255,255,255,0.88)', font: { size: 14 } },
    },
  },
  cutout: '0%',
}
