import { Container, Row, Col, Button, Badge } from 'react-bootstrap'

import Header from './components/Header'
import Footer from './components/Footer'
import HomePageCalories from './components/HomePageCalories'
import HomePageActivity from './components/HomePageActivity';
import HomePageDonut from './components/HomePageDonut';
import Reveal from './components/Reveal'

function App() {
  return (
    <div>
      <Header />
      <main className="py-3 app-shell">
        <Container>
          <section className="hero">
            <Reveal className="hero-inner">
              <h1 className="hero-title chart-title--dark">
                Your personal dashboard for calorie tracking and nutritional insights.
              </h1>
              <p className="hero-subtitle">
                Track meals, visualize progress, and build habits that stick — with clean charts and a simple workflow.
              </p>
              <div className="hero-actions">
                <Button size="lg" variant="info" className="hero-cta" href="/login">
                  Get started
                </Button>
                <Button size="lg" variant="outline-light" className="hero-cta-secondary" href="#features">
                  See features
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
                  <h2 className="section-title">Meals & calories</h2>
                  <p className="section-lead">
                    Easily track your meals, monitor your daily intake, and stay aware of your nutrition habits throughout the day.
                  </p>
                  <div className="feature-grid">
                    <div className="feature-card">
                      <div className="feature-title">Quick logging</div>
                      <div className="feature-text">Add meals in seconds and keep a clean daily timeline.</div>
                    </div>
                    <div className="feature-card">
                      <div className="feature-title">Progress visuals</div>
                      <div className="feature-text">Spot trends fast with interactive charts and readable stats.</div>
                    </div>
                    <div className="feature-card">
                      <div className="feature-title">Smarter decisions</div>
                      <div className="feature-text">Turn data into actionable nutrition choices.</div>
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
                  <h2 className="section-title section-title--dark">Training activity</h2>
                  <p className="section-lead section-lead--dark">
                    Every workout brings you closer to your goals. Track sessions, monitor progress, and stay motivated with real-time stats.
                  </p>
                  <div className="feature-grid feature-grid--light">
                    <div className="feature-card feature-card--light">
                      <div className="feature-title">Monthly insights</div>
                      <div className="feature-text">See consistency at a glance and keep your streak alive.</div>
                    </div>
                    <div className="feature-card feature-card--light">
                      <div className="feature-title">Simple goals</div>
                      <div className="feature-text">Set targets and use the graph as a weekly checkpoint.</div>
                    </div>
                    <div className="feature-card feature-card--light">
                      <div className="feature-title">Stay accountable</div>
                      <div className="feature-text">Small wins add up — the dashboard makes them visible.</div>
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
                  <h2 className="section-title">Macro balance</h2>
                  <p className="section-lead">
                    Understanding what fuels your body is the fastest way to improve performance. Track protein, fats, and carbs in real time.
                  </p>
                  <div className="callout">
                    <div className="callout-title">Balance isn’t a goal — it’s a system.</div>
                    <div className="callout-text">Make nutrition decisions with confidence using clear, visual feedback.</div>
                  </div>
                </Reveal>
              </Col>
            </Row>
          </section>
        </Container>
      </main>
      <Footer />
    </div >
  );
}

export default App;
