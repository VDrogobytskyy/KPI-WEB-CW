import React, { useMemo } from 'react'
import { Modal, Alert, Form, Button, Table } from 'react-bootstrap'

function MealModal({
  show,
  onHide,
  items,
  setItems,
  note,
  setNote,
  eatenAt,
  setEatenAt,
  onAddFood,
  customFoodDraft,
  setCustomFoodDraft,
  onCreateCustomFood,
  creatingCustomFood,
  onSave,
  saving,
  error,
}) {
  const totals = useMemo(() => {
    let kcal = 0
    let protein = 0
    let fat = 0
    let carbs = 0
    for (const it of items) {
      kcal += it.kcal_total || 0
      protein += it.protein_total || 0
      fat += it.fat_total || 0
      carbs += it.carbs_total || 0
    }
    return { kcal, protein, fat, carbs }
  }, [items])

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add meal</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Alert variant="secondary" className="mb-3">
          Add foods from USDA search. Grams drive totals (uses cached per-100g macros when available).
        </Alert>

        {error && <Alert variant="danger">{error}</Alert>}

        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Button variant="outline-info" size="sm" onClick={onAddFood} disabled={!onAddFood}>
              Add USDA food
            </Button>
          </div>
          <div style={{ opacity: 0.9 }}>
            Total: {Math.round(totals.kcal)} kcal · P {Math.round(totals.protein)} · F {Math.round(totals.fat)} · C{' '}
            {Math.round(totals.carbs)}
          </div>
        </div>

        <div className="mt-3" />

        <div className="chart-card" style={{ padding: 12, marginBottom: 14 }}>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>Add custom food (your own product/dish)</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <Form.Control
              placeholder="Name (required)"
              value={customFoodDraft?.name || ''}
              onChange={(e) => setCustomFoodDraft && setCustomFoodDraft((p) => ({ ...p, name: e.target.value }))}
            />
            <Form.Control
              placeholder="Brand (optional)"
              value={customFoodDraft?.brand || ''}
              onChange={(e) => setCustomFoodDraft && setCustomFoodDraft((p) => ({ ...p, brand: e.target.value }))}
            />
            <Form.Control
              type="number"
              inputMode="decimal"
              placeholder="kcal / 100g"
              value={customFoodDraft?.kcal_per_100g || ''}
              onChange={(e) =>
                setCustomFoodDraft && setCustomFoodDraft((p) => ({ ...p, kcal_per_100g: e.target.value }))
              }
            />
            <Form.Control
              type="number"
              inputMode="decimal"
              placeholder="protein / 100g"
              value={customFoodDraft?.protein_per_100g || ''}
              onChange={(e) =>
                setCustomFoodDraft && setCustomFoodDraft((p) => ({ ...p, protein_per_100g: e.target.value }))
              }
            />
            <Form.Control
              type="number"
              inputMode="decimal"
              placeholder="fat / 100g"
              value={customFoodDraft?.fat_per_100g || ''}
              onChange={(e) =>
                setCustomFoodDraft && setCustomFoodDraft((p) => ({ ...p, fat_per_100g: e.target.value }))
              }
            />
            <Form.Control
              type="number"
              inputMode="decimal"
              placeholder="carbs / 100g"
              value={customFoodDraft?.carbs_per_100g || ''}
              onChange={(e) =>
                setCustomFoodDraft && setCustomFoodDraft((p) => ({ ...p, carbs_per_100g: e.target.value }))
              }
            />
          </div>
          <div style={{ marginTop: 10 }}>
            <Button
              size="sm"
              variant="info"
              onClick={() => onCreateCustomFood && onCreateCustomFood()}
              disabled={!onCreateCustomFood || creatingCustomFood || !(customFoodDraft?.name || '').trim()}
            >
              {creatingCustomFood ? 'Creating…' : 'Create & add'}
            </Button>
          </div>
        </div>

        <Form.Group className="mb-3">
          <Form.Label>Eaten at</Form.Label>
          <Form.Control
            type="datetime-local"
            lang="en"
            value={eatenAt}
            onChange={(e) => setEatenAt && setEatenAt(e.target.value)}
          />
        </Form.Group>

        <Table bordered hover responsive size="sm">
          <thead>
            <tr>
              <th>Item</th>
              <th style={{ width: 120 }}>Grams</th>
              <th style={{ width: 110 }}>kcal</th>
              <th style={{ width: 80 }} />
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ opacity: 0.8 }}>
                  No foods added yet.
                </td>
              </tr>
            ) : (
              items.map((it, idx) => (
                <tr key={`${it.food_id}-${idx}`}>
                  <td>{it.name_snapshot}</td>
                  <td>
                    <Form.Control
                      type="number"
                      inputMode="decimal"
                      value={it.grams}
                      onChange={(e) => {
                        const grams = e.target.value
                        const g = Number(grams || 0)
                        const factor = g / 100
                        setItems((prev) =>
                          prev.map((p, i) =>
                            i === idx
                              ? {
                                  ...p,
                                  grams,
                                  kcal_total: (p.kcal_per_100g || 0) * factor,
                                  protein_total: (p.protein_per_100g || 0) * factor,
                                  fat_total: (p.fat_per_100g || 0) * factor,
                                  carbs_total: (p.carbs_per_100g || 0) * factor,
                                }
                              : p
                          )
                        )
                      }}
                    />
                  </td>
                  <td>{Math.round(it.kcal_total || 0)}</td>
                  <td>
                    <Button
                      size="sm"
                      variant="outline-light"
                      onClick={() => setItems((prev) => prev.filter((_, i) => i !== idx))}
                    >
                      Remove
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>

        <Form.Group>
          <Form.Label>Note (optional)</Form.Label>
          <Form.Control value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. Lunch" />
        </Form.Group>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="info" onClick={onSave} disabled={!onSave || saving || items.length === 0}>
          {saving ? 'Saving…' : 'Save'}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default MealModal
