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
  commonOptionsDark,
  donutOptionsDark,
}) {
  return (
    <>
      {!hasData && (
        <Alert variant="info" className="mb-4">
          No user data yet. Charts show empty scales. Use “Add meal” / “Add workout” to create mock entries
          (backend integration comes later).
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
                <h3 className="chart-title chart-title--dark">Calories consumed (7 days)</h3>
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
                <h3 className="chart-title chart-title--dark">Calories burned (7 days)</h3>
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
                <h3 className="chart-title chart-title--dark">Macros (today)</h3>
              </div>
              <div className="chart-canvas chart-canvas--donut">
                <Doughnut data={donutData} options={donutOptionsDark} />
              </div>
            </div>
          </div>
        </Col>

        <Col lg={6}>
          <h2 className="section-title">What the API will provide</h2>
          <p className="section-lead">
            These blocks map directly to endpoints (no backend wiring yet). Use this as a UI-ready blueprint.
          </p>
          <div className="feature-grid">
            <div className="feature-card">
              <div className="feature-title">Foods</div>
              <div className="feature-text">Search USDA and cache products.</div>
            </div>
            <div className="feature-card">
              <div className="feature-title">Meals</div>
              <div className="feature-text">Create meals with items and macros.</div>
            </div>
            <div className="feature-card">
              <div className="feature-title">Activities</div>
              <div className="feature-text">Log workouts, time, calories burned.</div>
            </div>
            <div className="feature-card">
              <div className="feature-title">Analytics</div>
              <div className="feature-text">Period filters for charts (day/week/month).</div>
            </div>
          </div>
        </Col>
      </Row>
    </>
  )
}

export default DashboardTab
