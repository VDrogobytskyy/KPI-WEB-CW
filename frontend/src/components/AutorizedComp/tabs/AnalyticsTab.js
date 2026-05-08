import React from 'react'
import { Row, Col, Form, Button, Alert } from 'react-bootstrap'

function AnalyticsTab({ analyticsForm, setAnalyticsForm }) {
  return (
    <>
      <div className="callout mb-3">
        <div className="callout-title">Endpoints scaffold</div>
        <div className="callout-text">
          Planned:
          <div style={{ marginTop: 8 }}>
            <div><code>GET /api/analytics/summary?from=...&to=...</code></div>
            <div><code>GET /api/analytics/macros?from=...&to=...</code></div>
            <div><code>GET /api/analytics/activity?from=...&to=...</code></div>
            <div><code>GET /api/report?from=...&to=...</code></div>
          </div>
        </div>
      </div>

      <div className="chart-card">
        <h3 className="chart-title chart-title--dark" style={{ marginBottom: 12 }}>
          Period filters (UI only)
        </h3>

        <Row className="g-3">
          <Col md={4}>
            <Form.Group>
              <Form.Label style={{ color: 'rgba(255,255,255,0.85)' }}>From</Form.Label>
              <Form.Control
                type="date"
                value={analyticsForm.from}
                onChange={(e) => setAnalyticsForm((p) => ({ ...p, from: e.target.value }))}
              />
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group>
              <Form.Label style={{ color: 'rgba(255,255,255,0.85)' }}>To</Form.Label>
              <Form.Control
                type="date"
                value={analyticsForm.to}
                onChange={(e) => setAnalyticsForm((p) => ({ ...p, to: e.target.value }))}
              />
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group>
              <Form.Label style={{ color: 'rgba(255,255,255,0.85)' }}>Group by</Form.Label>
              <Form.Select
                value={analyticsForm.groupBy}
                onChange={(e) => setAnalyticsForm((p) => ({ ...p, groupBy: e.target.value }))}
              >
                <option value="day">Day</option>
                <option value="week">Week</option>
                <option value="month">Month</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <div style={{ marginTop: 14, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Button variant="info" disabled>
            Apply (will call API)
          </Button>
          <Button variant="outline-light" disabled>
            Export report (will call API)
          </Button>
        </div>

        <Alert variant="secondary" className="mt-3 mb-0">
          After backend wiring, these controls will drive analytics endpoints and update charts.
        </Alert>
      </div>
    </>
  )
}

export default AnalyticsTab
