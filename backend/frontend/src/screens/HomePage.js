import React, { useCallback } from 'react'

import { Container, Row, Col, Button } from 'react-bootstrap'
import { useLocation, useNavigate } from 'react-router-dom'

import HomePageCalories from '../components/HomePageCalories'
import HomePageActivity from '../components/HomePageActivity';
import HomePageDonut from '../components/HomePageDonut';
import Reveal from '../components/Reveal'
import { useAuthToken } from '../auth/tokenStore'
import { useI18n } from '../i18n'

function HomePage() {
  const { t } = useI18n()
  const navigate = useNavigate()
  const location = useLocation()
  const token = useAuthToken()

  const goToFeatures = useCallback(() => {
    if (location.pathname !== '/') {
      navigate({ pathname: '/', hash: '#features' })
      return
    }
    const el = document.getElementById('features')
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [location.pathname, navigate])

  React.useEffect(() => {
    if (location.pathname !== '/') return
    if (location.hash !== '#features') return
    const el = document.getElementById('features')
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [location.pathname, location.hash])

  function handleGetStarted() {
    if (token) {
      navigate({ pathname: '/app', search: '?tab=profile' })
      return
    }
    navigate({ pathname: '/login', search: '?mode=register' })
  }

  return (
    <main className="app-shell">
        <Container>
          <section className="hero">
            <Reveal className="hero-inner">
              <h1 className="hero-title chart-title--dark">
                {t('heroTitle')}
              </h1>
              <p className="hero-subtitle">
                {t('heroSubtitle')}
              </p>
              <div className="hero-actions">
                <Button size="lg" variant="info" className="hero-cta" onClick={handleGetStarted}>
                  {t('getStarted')}
                </Button>
                <Button size="lg" variant="outline-light" className="hero-cta-secondary" onClick={goToFeatures}>
                  {t('seeFeatures')}
                </Button>
              </div>
            </Reveal>
          </section>

          <section id="features" className="section section-dark">
            <Row className="align-items-center g-4">
              <Col lg={6}>
                <Reveal>
                  <div className="chart-card">
                    <HomePageCalories variant="dark" />
                  </div>
                </Reveal>
              </Col>
              <Col lg={6}>
                <Reveal>
                  <h2 className="section-title">{t('mealsCalories')}</h2>
                  <p className="section-lead">
                    {t('mealsCaloriesText')}
                  </p>
                  <div className="feature-grid">
                    <div className="feature-card">
                      <div className="feature-title">{t('quickLogging')}</div>
                      <div className="feature-text">{t('quickLoggingText')}</div>
                    </div>
                    <div className="feature-card">
                      <div className="feature-title">{t('progressVisuals')}</div>
                      <div className="feature-text">{t('progressVisualsText')}</div>
                    </div>
                    <div className="feature-card">
                      <div className="feature-title">{t('smarterDecisions')}</div>
                      <div className="feature-text">{t('smarterDecisionsText')}</div>
                    </div>
                  </div>
                </Reveal>
              </Col>
            </Row>
          </section>
        </Container>

        <Container>
          <section className="section section-light">
            <Row className="align-items-center g-4 flex-lg-row-reverse">
              <Col lg={6}>
                <Reveal>
                  <div className="chart-card chart-card--light">
                    <HomePageActivity variant="light" />
                  </div>
                </Reveal>
              </Col>
              <Col lg={6}>
                <Reveal>
                  <h2 className="section-title section-title--dark">{t('trainingActivity')}</h2>
                  <p className="section-lead section-lead--dark">
                    {t('trainingActivityText')}
                  </p>
                  <div className="feature-grid feature-grid--light">
                    <div className="feature-card feature-card--light">
                      <div className="feature-title">{t('monthlyInsights')}</div>
                      <div className="feature-text">{t('monthlyInsightsText')}</div>
                    </div>
                    <div className="feature-card feature-card--light">
                      <div className="feature-title">{t('simpleGoals')}</div>
                      <div className="feature-text">{t('simpleGoalsText')}</div>
                    </div>
                    <div className="feature-card feature-card--light">
                      <div className="feature-title">{t('stayAccountable')}</div>
                      <div className="feature-text">{t('stayAccountableText')}</div>
                    </div>
                  </div>
                </Reveal>
              </Col>
            </Row>
          </section>
        </Container>

        <Container>
          <section className="section section-dark section-last">
            <Row className="align-items-center g-4">
              <Col lg={6}>
                <Reveal>
                  <div className="chart-card">
                    <HomePageDonut variant="dark" />
                  </div>
                </Reveal>
              </Col>
              <Col lg={6}>
                <Reveal>
                  <h2 className="section-title">{t('macroBalance')}</h2>
                  <p className="section-lead">
                    {t('macroBalanceText')}
                  </p>
                  <div className="callout">
                    <div className="callout-title">{t('balanceTitle')}</div>
                    <div className="callout-text">{t('balanceText')}</div>
                  </div>
                </Reveal>
              </Col>
            </Row>
          </section>
        </Container>
      </main>
  )
}

export default HomePage
