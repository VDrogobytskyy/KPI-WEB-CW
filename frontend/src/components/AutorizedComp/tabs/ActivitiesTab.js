import React from 'react'
import { Button, Table } from 'react-bootstrap'
import { useI18n } from '../../../i18n'

function ActivitiesTab({ workouts, onOpenWorkoutModal, onDeleteWorkout, deletingId }) {
  const { t } = useI18n()

  return (
    <>
      <div className="chart-card">
        <div className="chart-block-head">
          <h3 className="chart-title chart-title--dark">{t('workoutEntries')}</h3>
          <Button variant="info" size="sm" onClick={onOpenWorkoutModal}>
            {t('addWorkout')}
          </Button>
        </div>

        <Table responsive bordered hover size="sm" style={{ color: 'rgba(255,255,255,0.88)' }}>
          <thead>
            <tr>
              <th>{t('date')}</th>
              <th>{t('type')}</th>
              <th>{t('minutes')}</th>
              <th>{t('caloriesBurned')}</th>
              <th style={{ width: 110 }} />
            </tr>
          </thead>
          <tbody>
            {workouts.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ opacity: 0.8 }}>
                  {t('noWorkoutsYet')}
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
                      {deletingId === String(w.id) ? t('deleting') : t('delete')}
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
