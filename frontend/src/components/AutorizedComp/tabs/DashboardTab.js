import React from 'react'
import { Row, Col, Alert } from 'react-bootstrap'
import { Line, Bar, Doughnut } from 'react-chartjs-2'

function DashboardTab({
  hasData,
  dataByDay,
  macros,
  lineData,
  barData,
  donutData,
  burnProgressData,
  rangeLabel,
  commonOptionsDark,
  donutOptionsDark,
  progressDonutOptionsDark,
}) {
  return (
    <>
      {!hasData && (
        <Alert variant="info" className="mb-4">
          No entries yet. Add a meal or workout to populate the dashboard.
        </Alert>
      )}

      <Row className="g-4">
        <Col lg={4}>
          <div className="feature-card">
            <div className="feature-title">Calories in (today)</div>
            <div className="feature-text">
              {hasData ? `${Math.round(dataByDay.caloriesIn[dataByDay.caloriesIn.length - 1])} kcal` : '0 kcal'}
            </div>
          </div>
        </Col>

        <Col lg={4}>
          <div className="feature-card">
            <div className="feature-title">Calories out (today)</div>
            <div className="feature-text">
              {hasData ? `${Math.round(dataByDay.caloriesOut[dataByDay.caloriesOut.length - 1])} kcal` : '0 kcal'}
            </div>
          </div>
        </Col>

        <Col lg={4}>
          <div className="feature-card">
            <div className="feature-title">Macro total (today)</div>
            <div className="feature-text">
              {hasData
                ? `P ${Math.round(macros.protein)} / F ${Math.round(macros.fat)} / C ${Math.round(macros.carbs)}`
                : 'P 0 / F 0 / C 0'}
            </div>
          </div>
        </Col>
      </Row>

      <div className="mt-4" />

      <Row className="align-items-center g-4">
        <Col lg={6}>
          <div className="chart-card">
            <div className="chart-block">
              <div className="chart-block-head">
                <h3 className="chart-title chart-title--dark">Calories consumed</h3>
                {rangeLabel && (
                  <div style={{ opacity: 0.8, fontSize: 12, marginTop: -6 }}>{rangeLabel}</div>
                )}
              </div>
              <div className="chart-canvas">
                <Line data={lineData} options={commonOptionsDark} />
              </div>
            </div>
          </div>
        </Col>

        <Col lg={6}>
          <div className="chart-card">
            <div className="chart-block">
              <div className="chart-block-head">
                <h3 className="chart-title chart-title--dark">Calories burned</h3>
                {rangeLabel && (
                  <div style={{ opacity: 0.8, fontSize: 12, marginTop: -6 }}>{rangeLabel}</div>
                )}
              </div>
              <div className="chart-canvas">
                <Bar data={barData} options={commonOptionsDark} />
              </div>
            </div>
          </div>
        </Col>
      </Row>

      <div className="mt-4" />

      <Row className="align-items-center g-4">
        <Col lg={6}>
          <div className="chart-card">
            <div className="chart-block">
              <div className="chart-block-head chart-block-head--center">
                <h3 className="chart-title chart-title--dark">Macros</h3>
                {rangeLabel && (
                  <div style={{ opacity: 0.8, fontSize: 12, marginTop: -6 }}>{rangeLabel}</div>
                )}
              </div>
              <div className="chart-canvas chart-canvas--donut">
                <Doughnut data={donutData} options={donutOptionsDark} />
              </div>
            </div>
          </div>
        </Col>

        <Col lg={6}>
          <div className="chart-card">
            <div className="chart-block">
              <div className="chart-block-head">
                <h3 className="chart-title chart-title--dark">Burn progress</h3>
              </div>
              <div className="chart-canvas chart-canvas--donut">
                <Doughnut data={burnProgressData} options={progressDonutOptionsDark} />
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </>
  )
}

export default DashboardTab
