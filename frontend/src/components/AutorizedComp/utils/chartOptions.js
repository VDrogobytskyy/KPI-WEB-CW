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

export const progressDonutOptionsDark = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: { enabled: true },
  },
  cutout: '72%',
}

export const centerPercentPlugin = {
  id: 'centerPercent',
  afterDraw(chart) {
    const dataset = chart.data?.datasets?.[0]
    const value = Number(dataset?.data?.[0] || 0)
    const percent = Math.max(0, Math.min(100, Math.round(value)))
    const { ctx, chartArea } = chart

    if (!chartArea) return

    const x = (chartArea.left + chartArea.right) / 2
    const y = (chartArea.top + chartArea.bottom) / 2

    ctx.save()
    ctx.fillStyle = 'rgba(255,255,255,0.94)'
    ctx.font = '800 34px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(`${percent}%`, x, y)
    ctx.restore()
  },
}
