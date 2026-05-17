import React from 'react'
import { Row, Col, Alert } from 'react-bootstrap'
import { Line, Bar, Doughnut } from 'react-chartjs-2'
import { useI18n } from '../../../i18n'

function DashboardTab({
  hasData,
  dataByDay,
  macros,
  totals,
  lineData,
  barData,
  donutData,
  burnProgressData,
  rangeLabel,
  commonOptionsDark,
  donutOptionsDark,
  progressDonutOptionsDark,
  centerPercentPlugin,
}) {
  const { t } = useI18n()
  const kcalInTotal = totals?.kcalIn ?? 0
  const kcalOutTotal = totals?.kcalOut ?? 0
  const pTotal = totals?.protein ?? 0
  const fTotal = totals?.fat ?? 0
  const cTotal = totals?.carbs ?? 0

  return (
    <>
      {!hasData && (
        <Alert variant="info" className="mb-4">
          {t('dashboardEmpty')}
        </Alert>
      )}

      <Row className="g-4">
        <Col lg={4}>
          <div className="feature-card">
            <div className="feature-title">{t('caloriesInAllTime')}</div>
            <div className="feature-text">
              {hasData ? `${Math.round(kcalInTotal)} ${t('kcal')}` : `0 ${t('kcal')}`}
            </div>
          </div>
        </Col>

        <Col lg={4}>
          <div className="feature-card">
            <div className="feature-title">{t('caloriesOutAllTime')}</div>
            <div className="feature-text">
              {hasData ? `${Math.round(kcalOutTotal)} ${t('kcal')}` : `0 ${t('kcal')}`}
            </div>
          </div>
        </Col>

        <Col lg={4}>
          <div className="feature-card">
            <div className="feature-title">{t('macroTotalAllTime')}</div>
            <div className="feature-text">
              {hasData
                ? `P ${Math.round(pTotal)} / F ${Math.round(fTotal)} / C ${Math.round(cTotal)}`
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
                <h3 className="chart-title chart-title--dark">{t('caloriesConsumed')}</h3>
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
                <h3 className="chart-title chart-title--dark">{t('caloriesBurned')}</h3>
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
                <h3 className="chart-title chart-title--dark">{t('macros')}</h3>
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
                <h3 className="chart-title chart-title--dark">{t('burnProgress')}</h3>
              </div>
              <div className="chart-canvas chart-canvas--donut">
                <Doughnut
                  data={burnProgressData}
                  options={progressDonutOptionsDark}
                  plugins={centerPercentPlugin ? [centerPercentPlugin] : []}
                />
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </>
  )
}

export default DashboardTab
