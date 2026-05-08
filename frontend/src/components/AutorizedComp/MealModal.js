import React from 'react'
import { Modal, Alert, Form, Row, Col, Button } from 'react-bootstrap'

function MealModal({ show, onHide, mealForm, setMealForm, onSave }) {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add meal</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Alert variant="secondary" className="mb-3">
          Mock form. Later you’ll build meal items from selected <code>Food</code> records (USDA cache).
        </Alert>

        <Form>
          <Row className="g-3">
            <Col sm={12}>
              <Form.Group>
                <Form.Label>Calories</Form.Label>
                <Form.Control
                  type="number"
                  inputMode="numeric"
                  value={mealForm.calories}
                  onChange={(e) => setMealForm((p) => ({ ...p, calories: e.target.value }))}
                  placeholder="e.g. 650"
                />
              </Form.Group>
            </Col>

            <Col sm={4}>
              <Form.Group>
                <Form.Label>Protein</Form.Label>
                <Form.Control
                  type="number"
                  inputMode="numeric"
                  value={mealForm.protein}
                  onChange={(e) => setMealForm((p) => ({ ...p, protein: e.target.value }))}
                  placeholder="g"
                />
              </Form.Group>
            </Col>

            <Col sm={4}>
              <Form.Group>
                <Form.Label>Fat</Form.Label>
                <Form.Control
                  type="number"
                  inputMode="numeric"
                  value={mealForm.fat}
                  onChange={(e) => setMealForm((p) => ({ ...p, fat: e.target.value }))}
                  placeholder="g"
                />
              </Form.Group>
            </Col>

            <Col sm={4}>
              <Form.Group>
                <Form.Label>Carbs</Form.Label>
                <Form.Control
                  type="number"
                  inputMode="numeric"
                  value={mealForm.carbs}
                  onChange={(e) => setMealForm((p) => ({ ...p, carbs: e.target.value }))}
                  placeholder="g"
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
        <Button variant="info" onClick={onSave}>
          Save (mock)
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default MealModal
