import React from 'react'
import { Button } from 'react-bootstrap'
import Reveal from '../Reveal'
import { useI18n } from '../../i18n'

function MainButtons({ onOpenFoodSearch, onOpenMeal, onOpenWorkout }) {
  const { t } = useI18n()

  return (
    <section className="hero">
      <Reveal className="hero-inner">
        <h1 className="hero-title chart-title--dark">{t('dashboard')}</h1>
        <div className="hero-actions">
          <Button size="lg" variant="info" className="hero-cta" onClick={onOpenFoodSearch}>
            {t('searchFoodUsda')}
          </Button>

          <Button size="lg" variant="outline-light" className="hero-cta-secondary" onClick={onOpenMeal}>
            {t('addMeal')}
          </Button>

          <Button size="lg" variant="outline-light" className="hero-cta-secondary" onClick={onOpenWorkout}>
            {t('addWorkout')}
          </Button>
        </div>
      </Reveal>
    </section>
  )
}

export default MainButtons
