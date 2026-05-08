import React from 'react'
import { Button, Table, Alert } from 'react-bootstrap'

function MealsTab({ meals, onOpenMealModal }) {
  return (
    <>
      <div className="callout mb-3">
        <div className="callout-title">Endpoints scaffold</div>
        <div className="callout-text">
          Planned:
          <div style={{ marginTop: 8 }}>
            <div><code>GET /api/meals/?from=YYYY-MM-DD&to=YYYY-MM-DD</code></div>
            <div><code>POST /api/meals/</code></div>
            <div><code>GET /api/meals/:id</code></div>
            <div><code>PATCH /api/meals/:id</code></div>
            <div><code>DELETE /api/meals/:id</code></div>
          </div>
        </div>
      </div>

      <div className="chart-card">
        <div className="chart-block-head">
          <h3 className="chart-title chart-title--dark">Meal entries (mock)</h3>
          <Button variant="info" size="sm" onClick={onOpenMealModal}>
            Add meal
          </Button>
        </div>

        <Table responsive bordered hover size="sm" style={{ color: 'rgba(255,255,255,0.88)' }}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Calories</th>
              <th>Protein</th>
              <th>Fat</th>
              <th>Carbs</th>
            </tr>
          </thead>
          <tbody>
            {meals.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ opacity: 0.8 }}>
                  No meals yet.
                </td>
              </tr>
            ) : (
              meals.slice(0, 10).map((m) => (
                <tr key={m.id}>
                  <td>{m.dateKey}</td>
                  <td>{m.calories}</td>
                  <td>{m.protein}</td>
                  <td>{m.fat}</td>
                  <td>{m.carbs}</td>
                </tr>
              ))
            )}
          </tbody>
        </Table>

        <Alert variant="secondary" className="mb-0">
          Later this table will be populated from <code>GET /api/meals/</code>.
        </Alert>
      </div>
    </>
  )
}

export default MealsTab
