import React from 'react'
import { Row, Col, Form, Button, Alert, Card } from 'react-bootstrap'

function ProfileTab() {
  return (
    <>
      <div className="callout mb-3">
        <div className="callout-title">Endpoints scaffold</div>
        <div className="callout-text">
          Planned:
          <div style={{ marginTop: 8 }}>
            <div><code>GET /api/me/</code></div>
            <div><code>PATCH /api/me/</code></div>
          </div>
        </div>
      </div>

      <Row className="g-4">
        <Col lg={7}>
          <div className="chart-card">
            <h3 className="chart-title chart-title--dark" style={{ marginBottom: 12 }}>
              Profile settings (UI only)
            </h3>

            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label style={{ color: 'rgba(255,255,255,0.85)' }}>Username</Form.Label>
                  <Form.Control placeholder="username" disabled />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label style={{ color: 'rgba(255,255,255,0.85)' }}>Email</Form.Label>
                  <Form.Control placeholder="email@example.com" disabled />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group>
                  <Form.Label style={{ color: 'rgba(255,255,255,0.85)' }}>Weight (kg)</Form.Label>
                  <Form.Control type="number" placeholder="70" disabled />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label style={{ color: 'rgba(255,255,255,0.85)' }}>Height (cm)</Form.Label>
                  <Form.Control type="number" placeholder="175" disabled />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label style={{ color: 'rgba(255,255,255,0.85)' }}>Daily kcal goal</Form.Label>
                  <Form.Control type="number" placeholder="2200" disabled />
                </Form.Group>
              </Col>
            </Row>

            <div style={{ marginTop: 14 }}>
              <Button variant="info" disabled>
                Save (will call API)
              </Button>
            </div>
          </div>
        </Col>

        <Col lg={5}>
          <div className="chart-card">
            <h3 className="chart-title chart-title--dark" style={{ marginBottom: 12 }}>
              Auth (JWT later)
            </h3>

            <Alert variant="secondary">
              Planned:
              <div style={{ marginTop: 8 }}>
                <div><code>POST /api/auth/register</code></div>
                <div><code>POST /api/auth/login</code></div>
                <div><code>POST /api/auth/refresh</code></div>
              </div>
            </Alert>

            <Card bg="dark" text="light" style={{ border: '1px solid rgba(255,255,255,0.10)' }}>
              <Card.Body>
                <Card.Title style={{ fontSize: '1rem' }}>Request header</Card.Title>
                <Card.Text style={{ opacity: 0.9, marginBottom: 8 }}>
                  Private endpoints will require:
                </Card.Text>
                <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                  Authorization: Bearer {'<access_token>'}
                </pre>
              </Card.Body>
            </Card>
          </div>
        </Col>
      </Row>
    </>
  )
}

export default ProfileTab
