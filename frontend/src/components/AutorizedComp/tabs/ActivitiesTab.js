import React from 'react'
import { Button, Table, Alert } from 'react-bootstrap'

function ActivitiesTab({ workouts, onOpenWorkoutModal }) {
  return (
    <>
      <div className="callout mb-3">
        <div className="callout-title">Endpoints scaffold</div>
        <div className="callout-text">
          Planned:
          <div style={{ marginTop: 8 }}>
            <div><code>GET /api/activities/?from=YYYY-MM-DD&to=YYYY-MM-DD</code></div>
            <div><code>POST /api/activities/</code></div>
            <div><code>PATCH /api/activities/:id</code></div>
            <div><code>DELETE /api/activities/:id</code></div>
          </div>
        </div>
      </div>

      <div className="chart-card">
        <div className="chart-block-head">
          <h3 className="chart-title chart-title--dark">Workout entries (mock)</h3>
          <Button variant="info" size="sm" onClick={onOpenWorkoutModal}>
            Add workout
          </Button>
        </div>

        <Table responsive bordered hover size="sm" style={{ color: 'rgba(255,255,255,0.88)' }}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Minutes</th>
              <th>Calories burned</th>
            </tr>
          </thead>
          <tbody>
            {workouts.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ opacity: 0.8 }}>
                  No workouts yet.
                </td>
              </tr>
            ) : (
              workouts.slice(0, 10).map((w) => (
                <tr key={w.id}>
                  <td>{w.dateKey}</td>
                  <td>{w.type}</td>
                  <td>{w.minutes}</td>
                  <td>{w.caloriesBurned}</td>
                </tr>
              ))
            )}
          </tbody>
        </Table>

        <Alert variant="secondary" className="mb-0">
          Later this table will be populated from <code>GET /api/activities/</code>.
        </Alert>
      </div>
    </>
  )
}

export default ActivitiesTab
