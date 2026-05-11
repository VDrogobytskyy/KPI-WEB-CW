import React from 'react'
import { Modal, Alert, Form, Row, Col, Button } from 'react-bootstrap'

function WorkoutModal({
  show,
  onHide,
  workoutForm,
  setWorkoutForm,
  startedAt,
  setStartedAt,
  onSave,
  saving,
  error,
}) {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add workout</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Alert variant="secondary" className="mb-3">This creates a workout entry in your database.</Alert>
        {error && <Alert variant="danger">{error}</Alert>}

        <Form>
          <Row className="g-3">
            <Col sm={12}>
              <Form.Group>
                <Form.Label>Started at</Form.Label>
                <Form.Control
                  type="datetime-local"
                  lang="en"
                  value={startedAt}
                  onChange={(e) => setStartedAt && setStartedAt(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col sm={12}>
              <Form.Group>
                <Form.Label>Workout type</Form.Label>
                <Form.Control
                  value={workoutForm.type}
                  onChange={(e) => setWorkoutForm((p) => ({ ...p, type: e.target.value }))}
                  placeholder="e.g. Running"
                />
              </Form.Group>
            </Col>

            <Col sm={6}>
              <Form.Group>
                <Form.Label>Calories burned</Form.Label>
                <Form.Control
                  type="number"
                  inputMode="numeric"
                  value={workoutForm.caloriesBurned}
                  onChange={(e) => setWorkoutForm((p) => ({ ...p, caloriesBurned: e.target.value }))}
                  placeholder="e.g. 320"
                />
              </Form.Group>
            </Col>

            <Col sm={6}>
              <Form.Group>
                <Form.Label>Minutes</Form.Label>
                <Form.Control
                  type="number"
                  inputMode="numeric"
                  value={workoutForm.minutes}
                  onChange={(e) => setWorkoutForm((p) => ({ ...p, minutes: e.target.value }))}
                  placeholder="e.g. 45"
                />
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="info" onClick={onSave} disabled={!onSave || saving}>
          {saving ? 'Saving…' : 'Save'}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default WorkoutModal
