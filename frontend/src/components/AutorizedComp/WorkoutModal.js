import React from 'react'
import { Modal, Alert, Form, Row, Col, Button } from 'react-bootstrap'
import { useI18n } from '../../i18n'

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
  const { t, language } = useI18n()

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('addWorkout')}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}

        <Form>
          <Row className="g-3">
            <Col sm={12}>
              <Form.Group>
                <Form.Label>{t('startedAt')}</Form.Label>
                <Form.Control
                  type="datetime-local"
                  lang={language}
                  value={startedAt}
                  onChange={(e) => setStartedAt && setStartedAt(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col sm={12}>
              <Form.Group>
                <Form.Label>{t('workoutType')}</Form.Label>
                <Form.Control
                  value={workoutForm.type}
                  onChange={(e) => setWorkoutForm((p) => ({ ...p, type: e.target.value }))}
                  placeholder={t('workoutTypePlaceholder')}
                />
              </Form.Group>
            </Col>

            <Col sm={6}>
              <Form.Group>
                <Form.Label>{t('caloriesBurnedField')}</Form.Label>
                <Form.Control
                  type="number"
                  inputMode="numeric"
                  value={workoutForm.caloriesBurned}
                  onChange={(e) => setWorkoutForm((p) => ({ ...p, caloriesBurned: e.target.value }))}
                  placeholder="320"
                />
              </Form.Group>
            </Col>

            <Col sm={6}>
              <Form.Group>
                <Form.Label>{t('minutes')}</Form.Label>
                <Form.Control
                  type="number"
                  inputMode="numeric"
                  value={workoutForm.minutes}
                  onChange={(e) => setWorkoutForm((p) => ({ ...p, minutes: e.target.value }))}
                  placeholder="45"
                />
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          {t('cancel')}
        </Button>
        <Button variant="info" onClick={onSave} disabled={!onSave || saving}>
          {saving ? t('saving') : t('save')}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default WorkoutModal
