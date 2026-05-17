import React from 'react'
import { Row, Col, Form, Button, Alert } from 'react-bootstrap'
import { Line, Bar, Doughnut } from 'react-chartjs-2'
import { useI18n } from '../../../i18n'

function AnalyticsTab({
  analyticsForm,
  setAnalyticsForm,
  onApply,
  summary,
  applying,
  error,
  lineData,
  barData,
  donutData,
  burnProgressData,
  commonOptionsDark,
  donutOptionsDark,
  progressDonutOptionsDark,
  centerPercentPlugin,
}) {
  const { t, language } = useI18n()

  return (
    <>
      <div className="chart-card">
        <h3 className="chart-title chart-title--dark" style={{ marginBottom: 12 }}>{t('periodFilters')}</h3>

        {error && <Alert variant="danger">{error}</Alert>}

        <Row className="g-3">
          <Col md={4}>
            <Form.Group>
              <Form.Label style={{ color: 'rgba(255,255,255,0.85)' }}>{t('from')}</Form.Label>
              <Form.Control
                type="date"
                lang={language}
                className="analytics-date-control"
                value={analyticsForm.from}
                onChange={(e) => setAnalyticsForm((p) => ({ ...p, from: e.target.value }))}
              />
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group>
              <Form.Label style={{ color: 'rgba(255,255,255,0.85)' }}>{t('to')}</Form.Label>
              <Form.Control
                type="date"
                lang={language}
                className="analytics-date-control"
                value={analyticsForm.to}
                onChange={(e) => setAnalyticsForm((p) => ({ ...p, to: e.target.value }))}
              />
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group>
              <Form.Label style={{ color: 'rgba(255,255,255,0.85)' }}>{t('groupBy')}</Form.Label>
              <Form.Select
                value={analyticsForm.groupBy}
                onChange={(e) => setAnalyticsForm((p) => ({ ...p, groupBy: e.target.value }))}
              >
                <option value="day">{t('day')}</option>
                <option value="week">{t('week')}</option>
                <option value="month">{t('month')}</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <div style={{ marginTop: 14, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Button
            variant="info"
            onClick={() => onApply && onApply()}
            disabled={!onApply || applying || (!analyticsForm.from && !analyticsForm.to)}
          >
            {applying ? t('applying') : t('apply')}
          </Button>
        </div>

        {summary && (
          <Alert variant="secondary" className="mt-3 mb-0">
            {t('totals')}: {Math.round(summary.kcalIn)} {t('kcalIn')}, {Math.round(summary.kcalOut)} {t('kcalOut')}, P{' '}
            {Math.round(summary.protein)} / F {Math.round(summary.fat)} / C {Math.round(summary.carbs)}
          </Alert>
        )}
      </div>

      <div className="mt-4" />

      <Row className="align-items-center g-4">
        <Col lg={6}>
          <div className="chart-card">
            <div className="chart-block">
              <div className="chart-block-head">
                <h3 className="chart-title chart-title--dark">{t('caloriesInPeriod')}</h3>
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
                <h3 className="chart-title chart-title--dark">{t('caloriesOutPeriod')}</h3>
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
                <h3 className="chart-title chart-title--dark">{t('macrosPeriod')}</h3>
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
                <h3 className="chart-title chart-title--dark">{t('burnProgressPeriod')}</h3>
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

export default AnalyticsTab
