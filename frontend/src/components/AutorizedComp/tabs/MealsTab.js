import React from 'react'
import { Button, Table } from 'react-bootstrap'
import { useI18n } from '../../../i18n'

function MealsTab({ meals, onOpenMealModal, onDeleteMeal, deletingId }) {
  const { t } = useI18n()

  return (
    <>
      <div className="chart-card">
        <div className="chart-block-head">
          <h3 className="chart-title chart-title--dark">{t('mealEntries')}</h3>
          <Button variant="info" size="sm" onClick={onOpenMealModal}>
            {t('addMeal')}
          </Button>
        </div>

        <Table responsive bordered hover size="sm" style={{ color: 'rgba(255,255,255,0.88)' }}>
          <thead>
            <tr>
              <th>{t('date')}</th>
              <th>{t('calories')}</th>
              <th>{t('protein')}</th>
              <th>{t('fat')}</th>
              <th>{t('carbs')}</th>
              <th style={{ width: 110 }} />
            </tr>
          </thead>
          <tbody>
            {meals.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ opacity: 0.8 }}>
                  {t('noMealsYet')}
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
                  <td>
                    <Button
                      size="sm"
                      variant="outline-light"
                      onClick={() => onDeleteMeal && onDeleteMeal(m.id)}
                      disabled={!onDeleteMeal || deletingId === String(m.id)}
                    >
                      {deletingId === String(m.id) ? t('deleting') : t('delete')}
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

export default MealsTab
