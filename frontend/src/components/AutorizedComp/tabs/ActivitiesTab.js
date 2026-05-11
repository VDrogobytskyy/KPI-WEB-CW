import React from 'react'
import { Button, Table } from 'react-bootstrap'

function ActivitiesTab({ workouts, onOpenWorkoutModal, onDeleteWorkout, deletingId }) {
  return (
    <>
      <div className="chart-card">
        <div className="chart-block-head">
          <h3 className="chart-title chart-title--dark">Workout entries</h3>
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
              <th style={{ width: 110 }} />
            </tr>
          </thead>
          <tbody>
            {workouts.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ opacity: 0.8 }}>
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
                  <td>
                    <Button
                      size="sm"
                      variant="outline-light"
                      onClick={() => onDeleteWorkout && onDeleteWorkout(w.id)}
                      disabled={!onDeleteWorkout || deletingId === String(w.id)}
                    >
                      {deletingId === String(w.id) ? 'Deleting…' : 'Delete'}
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>
    </>
  )
}

export default ActivitiesTab
