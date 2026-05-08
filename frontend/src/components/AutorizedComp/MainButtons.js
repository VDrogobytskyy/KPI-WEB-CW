import React from 'react'
import { Button } from 'react-bootstrap'
import Reveal from '../Reveal'

function MainButtons({ onOpenFoodSearch, onOpenMeal, onOpenWorkout }) {
  return (
    <section className="hero">
      <Reveal className="hero-inner">
        <h1 className="hero-title chart-title--dark">Dashboard</h1>
        <div className="hero-actions">
          <Button size="lg" variant="info" className="hero-cta" onClick={onOpenFoodSearch}>
            Search food (USDA)
          </Button>

          <Button size="lg" variant="outline-light" className="hero-cta-secondary" onClick={onOpenMeal}>
            Add meal
          </Button>

          <Button size="lg" variant="outline-light" className="hero-cta-secondary" onClick={onOpenWorkout}>
            Add workout
          </Button>
        </div>
      </Reveal>
    </section>
  )
}

export default MainButtons
