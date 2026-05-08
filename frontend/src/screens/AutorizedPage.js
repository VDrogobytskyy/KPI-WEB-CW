// src/screens/AutorizedPage.js
import React, { useMemo, useState } from 'react'

import {
  Container,
  Row,
  Col,
  Button,
  Badge,
  Modal,
  Form,
  Tabs,
  Tab,
  Alert,
  Table,
  InputGroup,
  Card,
  Spinner,
} from 'react-bootstrap'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js'
import { Line, Bar, Doughnut } from 'react-chartjs-2'

import Reveal from '../components/Reveal'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
)

function startOfDay(date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

function dayKey(date) {
  const d = startOfDay(date)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function lastNDaysLabels(n) {
  const labels = []
  const keys = []
  const today = startOfDay(new Date())
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    labels.push(d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }))
    keys.push(dayKey(d))
  }
  return { labels, keys }
}

function sumNumber(value) {
  const num = Number(value)
  return Number.isFinite(num) ? num : 0
}

function AutorizedPage() {
  // Frontend-only mock storage:
  // meals: { id, dateKey, calories, protein, fat, carbs }
  // workouts: { id, dateKey, caloriesBurned, minutes, type }
  const [meals, setMeals] = useState([])
  const [workouts, setWorkouts] = useState([])

  // UI state
  const [activeTab, setActiveTab] = useState('dashboard')

  // Modals
  const [showMealModal, setShowMealModal] = useState(false)
  const [showWorkoutModal, setShowWorkoutModal] = useState(false)
  const [showFoodSearchModal, setShowFoodSearchModal] = useState(false)

  // Forms
  const [mealForm, setMealForm] = useState({
    calories: '',
    protein: '',
    fat: '',
    carbs: '',
  })

  const [workoutForm, setWorkoutForm] = useState({
    type: '',
    caloriesBurned: '',
    minutes: '',
  })

  const [foodSearchForm, setFoodSearchForm] = useState({
    query: '',
  })

  const [analyticsForm, setAnalyticsForm] = useState({
    from: '',
    to: '',
    groupBy: 'day',
  })

  // Food search state (REAL SEARCH)
  const [foodLoading, setFoodLoading] = useState(false)
  const [foodError, setFoodError] = useState('')
  const [foodResults, setFoodResults] = useState([])

  async function runFoodSearch() {
    const q = foodSearchForm.query.trim()
    if (!q) return

    setFoodError('')
    setFoodLoading(true)
    try {
      const res = await fetch(`/api/foods/search/?q=${encodeURIComponent(q)}&pageSize=10`)
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data?.detail || 'Search failed')
      }
      setFoodResults(Array.isArray(data?.foods) ? data.foods : [])
    } catch (e) {
      setFoodResults([])
      setFoodError(e?.message || 'Search failed')
    } finally {
      setFoodLoading(false)
    }
  }

  const hasData = meals.length > 0 || workouts.length > 0

  // Charts data (kept working as local mock)
  const { labels, keys } = useMemo(() => lastNDaysLabels(7), [])
  const dataByDay = useMemo(() => {
    const caloriesInMap = Object.fromEntries(keys.map((k) => [k, 0]))
    const caloriesOutMap = Object.fromEntries(keys.map((k) => [k, 0]))

    for (const meal of meals) {
      if (meal?.dateKey in caloriesInMap) caloriesInMap[meal.dateKey] += sumNumber(meal.calories)
    }
    for (const w of workouts) {
      if (w?.dateKey in caloriesOutMap) caloriesOutMap[w.dateKey] += sumNumber(w.caloriesBurned)
    }

    const caloriesIn = keys.map((k) => caloriesInMap[k] ?? 0)
    const caloriesOut = keys.map((k) => caloriesOutMap[k] ?? 0)

    return { caloriesIn, caloriesOut }
  }, [keys, meals, workouts])

  const macros = useMemo(() => {
    let protein = 0
    let fat = 0
    let carbs = 0
    for (const meal of meals) {
      protein += sumNumber(meal.protein)
      fat += sumNumber(meal.fat)
      carbs += sumNumber(meal.carbs)
    }
    return { protein, fat, carbs }
  }, [meals])

  const tickColorDark = 'rgba(255,255,255,0.85)'
  const gridColorDark = 'rgba(255,255,255,0.12)'

  const lineData = useMemo(() => {
    const series = hasData ? dataByDay.caloriesIn : keys.map(() => 0)
    return {
      labels,
      datasets: [
        {
          data: series,
          borderColor: 'rgba(255,255,255,0.92)',
          backgroundColor: 'rgba(11, 184, 203, 0.30)',
          tension: 0.3,
          pointRadius: hasData ? 3 : 0,
          pointHoverRadius: hasData ? 5 : 0,
          fill: true,
        },
      ],
    }
  }, [dataByDay.caloriesIn, hasData, keys, labels])

  const barData = useMemo(() => {
    const series = hasData ? dataByDay.caloriesOut : keys.map(() => 0)
    return {
      labels,
      datasets: [
        {
          data: series,
          backgroundColor: 'rgba(11, 184, 203, 0.6)',
          borderRadius: 10,
        },
      ],
    }
  }, [dataByDay.caloriesOut, hasData, keys, labels])

  const donutData = useMemo(() => {
    const p = hasData ? macros.protein : 0
    const f = hasData ? macros.fat : 0
    const c = hasData ? macros.carbs : 0
    return {
      labels: ['Protein', 'Fat', 'Carbohydrates'],
      datasets: [
        {
          data: [p, f, c],
          backgroundColor: ['rgba(11, 184, 203, 0.6)', '#d4a20b', '#268bd2'],
          borderColor: 'rgba(255,255,255,0.85)',
          borderWidth: 1,
        },
      ],
    }
  }, [hasData, macros.carbs, macros.fat, macros.protein])

  const commonOptionsDark = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { ticks: { color: tickColorDark }, grid: { color: gridColorDark } },
      y: { ticks: { color: tickColorDark }, grid: { color: gridColorDark } },
    },
  }

  const donutOptionsDark = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: 'rgba(255,255,255,0.88)', font: { size: 14 } },
      },
    },
    cutout: '0%',
  }

  // Minimal local actions (optional — page still works as a scaffold)
  function addMeal() {
    const payload = {
      id: crypto?.randomUUID ? crypto.randomUUID() : String(Date.now()),
      dateKey: dayKey(new Date()),
      calories: sumNumber(mealForm.calories),
      protein: sumNumber(mealForm.protein),
      fat: sumNumber(mealForm.fat),
      carbs: sumNumber(mealForm.carbs),
    }
    setMeals((prev) => [payload, ...prev])
    setMealForm({ calories: '', protein: '', fat: '', carbs: '' })
    setShowMealModal(false)
  }

  function addWorkout() {
    const payload = {
      id: crypto?.randomUUID ? crypto.randomUUID() : String(Date.now()),
      dateKey: dayKey(new Date()),
      type: String(workoutForm.type || '').trim() || 'Workout',
      caloriesBurned: sumNumber(workoutForm.caloriesBurned),
      minutes: sumNumber(workoutForm.minutes),
    }
    setWorkouts((prev) => [payload, ...prev])
    setWorkoutForm({ type: '', caloriesBurned: '', minutes: '' })
    setShowWorkoutModal(false)
  }

  return (
    <main className="app-shell">
      <Container>
        <section className="hero">
          <Reveal className="hero-inner">
            <Badge bg="info" className="hero-pill">
              Authorized dashboard
            </Badge>
            <h1 className="hero-title chart-title--dark">Dashboard</h1>
            <p className="hero-subtitle">
              UI scaffold for your API: Foods (USDA), Meals, Activities, Analytics, Profile, Auth (JWT later).
            </p>
            <div className="hero-actions">
              <Button size="lg" variant="info" className="hero-cta" onClick={() => setShowFoodSearchModal(true)}>
                Search food (USDA)
              </Button>
              <Button
                size="lg"
                variant="outline-light"
                className="hero-cta-secondary"
                onClick={() => setShowMealModal(true)}
              >
                Add meal
              </Button>
              <Button
                size="lg"
                variant="outline-light"
                className="hero-cta-secondary"
                onClick={() => setShowWorkoutModal(true)}
              >
                Add workout
              </Button>
            </div>
          </Reveal>
        </section>

        <section className="section section-dark">
          <Reveal>
            <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k || 'dashboard')} className="mb-3">
              <Tab eventKey="dashboard" title="Dashboard">
                {!hasData && (
                  <Alert variant="info" className="mb-4">
                    No user data yet. Charts show empty scales. Use “Add meal” / “Add workout” to create mock entries
                    (backend integration comes later).
                  </Alert>
                )}

                <Row className="g-4">
                  <Col lg={4}>
                    <div className="feature-card">
                      <div className="feature-title">Calories in (today)</div>
                      <div className="feature-text">
                        {hasData ? `${Math.round(dataByDay.caloriesIn[dataByDay.caloriesIn.length - 1])} kcal` : '0 kcal'}
                      </div>
                    </div>
                  </Col>
                  <Col lg={4}>
                    <div className="feature-card">
                      <div className="feature-title">Calories out (today)</div>
                      <div className="feature-text">
                        {hasData ? `${Math.round(dataByDay.caloriesOut[dataByDay.caloriesOut.length - 1])} kcal` : '0 kcal'}
                      </div>
                    </div>
                  </Col>
                  <Col lg={4}>
                    <div className="feature-card">
                      <div className="feature-title">Macro total (today)</div>
                      <div className="feature-text">
                        {hasData
                          ? `P ${Math.round(macros.protein)} / F ${Math.round(macros.fat)} / C ${Math.round(macros.carbs)}`
                          : 'P 0 / F 0 / C 0'}
                      </div>
                    </div>
                  </Col>
                </Row>

                <div className="mt-4" />

                <Row className="align-items-center g-4">
                  <Col lg={6}>
                    <div className="chart-card">
                      <div className="chart-block">
                        <div className="chart-block-head">
                          <h3 className="chart-title chart-title--dark">Calories consumed (7 days)</h3>
                        </div>
                        <div className="chart-canvas">
                          <Line data={lineData} options={commonOptionsDark} />
                        </div>
                      </div>
                    </div>
                  </Col>

                  <Col lg={6}>
                    <div className="chart-card">
                      <div className="chart-block">
                        <div className="chart-block-head">
                          <h3 className="chart-title chart-title--dark">Calories burned (7 days)</h3>
                        </div>
                        <div className="chart-canvas">
                          <Bar data={barData} options={commonOptionsDark} />
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>

                <div className="mt-4" />

                <Row className="align-items-center g-4">
                  <Col lg={6}>
                    <div className="chart-card">
                      <div className="chart-block">
                        <div className="chart-block-head chart-block-head--center">
                          <h3 className="chart-title chart-title--dark">Macros (today)</h3>
                        </div>
                        <div className="chart-canvas chart-canvas--donut">
                          <Doughnut data={donutData} options={donutOptionsDark} />
                        </div>
                      </div>
                    </div>
                  </Col>

                  <Col lg={6}>
                    <h2 className="section-title">What the API will provide</h2>
                    <p className="section-lead">
                      These blocks map directly to endpoints (no backend wiring yet). Use this as a UI-ready blueprint.
                    </p>
                    <div className="feature-grid">
                      <div className="feature-card">
                        <div className="feature-title">Foods</div>
                        <div className="feature-text">Search USDA and cache products.</div>
                      </div>
                      <div className="feature-card">
                        <div className="feature-title">Meals</div>
                        <div className="feature-text">Create meals with items and macros.</div>
                      </div>
                      <div className="feature-card">
                        <div className="feature-title">Activities</div>
                        <div className="feature-text">Log workouts, time, calories burned.</div>
                      </div>
                      <div className="feature-card">
                        <div className="feature-title">Analytics</div>
                        <div className="feature-text">Period filters for charts (day/week/month).</div>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Tab>

              <Tab eventKey="foods" title="Foods (USDA)">
                <div className="callout mb-3">
                  <div className="callout-title">Endpoints scaffold</div>
                  <div className="callout-text">
                    Planned:
                    <div style={{ marginTop: 8 }}>
                      <div><code>GET /api/foods/?search=banana</code></div>
                      <div><code>GET /api/foods/:id</code></div>
                      <div><code>POST /api/foods/</code></div>
                      <div><code>PATCH /api/foods/:id</code></div>
                      <div><code>DELETE /api/foods/:id</code></div>
                    </div>
                  </div>
                </div>

                <div className="chart-card">
                  <h3 className="chart-title chart-title--dark" style={{ marginBottom: 12 }}>
                    Food search (UI + API)
                  </h3>

                  <InputGroup className="mb-3">
                    <Form.Control
                      value={foodSearchForm.query}
                      onChange={(e) => setFoodSearchForm((p) => ({ ...p, query: e.target.value }))}
                      placeholder="Search product name, e.g. banana"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          runFoodSearch()
                        }
                      }}
                    />
                    <Button variant="info" onClick={runFoodSearch} disabled={foodLoading || !foodSearchForm.query.trim()}>
                      {foodLoading ? (
                        <>
                          <Spinner animation="border" size="sm" className="me-2" />
                          Searching
                        </>
                      ) : (
                        'Search'
                      )}
                    </Button>
                  </InputGroup>

                  {foodError && <Alert variant="danger">{foodError}</Alert>}

                  <Table responsive bordered hover size="sm" style={{ color: 'rgba(255,255,255,0.88)' }}>
                    <thead>
                      <tr>
                        <th>Description</th>
                        <th>Brand</th>
                        <th>Type</th>
                        <th style={{ width: 110 }}>FDC ID</th>
                      </tr>
                    </thead>
                    <tbody>
                      {foodResults.length === 0 ? (
                        <tr>
                          <td colSpan={4} style={{ opacity: 0.8 }}>
                            {foodLoading ? 'Loading…' : 'No results yet.'}
                          </td>
                        </tr>
                      ) : (
                        foodResults.map((f) => (
                          <tr key={String(f.fdcId)}>
                            <td>{f.description || '-'}</td>
                            <td>{f.brandOwner || '-'}</td>
                            <td>{f.dataType || '-'}</td>
                            <td>{f.fdcId}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </Table>
                </div>
              </Tab>

              <Tab eventKey="meals" title="Meals">
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
                    <Button variant="info" size="sm" onClick={() => setShowMealModal(true)}>
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
              </Tab>

              <Tab eventKey="activities" title="Activities">
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
                    <Button variant="info" size="sm" onClick={() => setShowWorkoutModal(true)}>
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
              </Tab>

              <Tab eventKey="analytics" title="Analytics">
                <div className="callout mb-3">
                  <div className="callout-title">Endpoints scaffold</div>
                  <div className="callout-text">
                    Planned:
                    <div style={{ marginTop: 8 }}>
                      <div><code>GET /api/analytics/summary?from=...&to=...</code></div>
                      <div><code>GET /api/analytics/macros?from=...&to=...</code></div>
                      <div><code>GET /api/analytics/activity?from=...&to=...</code></div>
                      <div><code>GET /api/report?from=...&to=...</code></div>
                    </div>
                  </div>
                </div>

                <div className="chart-card">
                  <h3 className="chart-title chart-title--dark" style={{ marginBottom: 12 }}>
                    Period filters (UI only)
                  </h3>

                  <Row className="g-3">
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label style={{ color: 'rgba(255,255,255,0.85)' }}>From</Form.Label>
                        <Form.Control
                          type="date"
                          value={analyticsForm.from}
                          onChange={(e) => setAnalyticsForm((p) => ({ ...p, from: e.target.value }))}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label style={{ color: 'rgba(255,255,255,0.85)' }}>To</Form.Label>
                        <Form.Control
                          type="date"
                          value={analyticsForm.to}
                          onChange={(e) => setAnalyticsForm((p) => ({ ...p, to: e.target.value }))}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label style={{ color: 'rgba(255,255,255,0.85)' }}>Group by</Form.Label>
                        <Form.Select
                          value={analyticsForm.groupBy}
                          onChange={(e) => setAnalyticsForm((p) => ({ ...p, groupBy: e.target.value }))}
                        >
                          <option value="day">Day</option>
                          <option value="week">Week</option>
                          <option value="month">Month</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>

                  <div style={{ marginTop: 14, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    <Button variant="info" disabled>
                      Apply (will call API)
                    </Button>
                    <Button variant="outline-light" disabled>
                      Export report (will call API)
                    </Button>
                  </div>

                  <Alert variant="secondary" className="mt-3 mb-0">
                    After backend wiring, these controls will drive analytics endpoints and update charts.
                  </Alert>
                </div>
              </Tab>

              <Tab eventKey="profile" title="Profile">
                <div className="callout mb-3">
                  <div className="callout-title">Endpoints scaffold</div>
                  <div className="callout-text">
                    Planned:
                    <div style={{ marginTop: 8 }}>
                      <div><code>GET /api/me/</code></div>
                      <div><code>PATCH /api/me/</code></div>
                    </div>
                  </div>
                </div>

                <Row className="g-4">
                  <Col lg={7}>
                    <div className="chart-card">
                      <h3 className="chart-title chart-title--dark" style={{ marginBottom: 12 }}>
                        Profile settings (UI only)
                      </h3>

                      <Row className="g-3">
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label style={{ color: 'rgba(255,255,255,0.85)' }}>Username</Form.Label>
                            <Form.Control placeholder="username" disabled />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label style={{ color: 'rgba(255,255,255,0.85)' }}>Email</Form.Label>
                            <Form.Control placeholder="email@example.com" disabled />
                          </Form.Group>
                        </Col>
                        <Col md={4}>
                          <Form.Group>
                            <Form.Label style={{ color: 'rgba(255,255,255,0.85)' }}>Weight (kg)</Form.Label>
                            <Form.Control type="number" placeholder="70" disabled />
                          </Form.Group>
                        </Col>
                        <Col md={4}>
                          <Form.Group>
                            <Form.Label style={{ color: 'rgba(255,255,255,0.85)' }}>Height (cm)</Form.Label>
                            <Form.Control type="number" placeholder="175" disabled />
                          </Form.Group>
                        </Col>
                        <Col md={4}>
                          <Form.Group>
                            <Form.Label style={{ color: 'rgba(255,255,255,0.85)' }}>Daily kcal goal</Form.Label>
                            <Form.Control type="number" placeholder="2200" disabled />
                          </Form.Group>
                        </Col>
                      </Row>

                      <div style={{ marginTop: 14 }}>
                        <Button variant="info" disabled>
                          Save (will call API)
                        </Button>
                      </div>
                    </div>
                  </Col>

                  <Col lg={5}>
                    <div className="chart-card">
                      <h3 className="chart-title chart-title--dark" style={{ marginBottom: 12 }}>
                        Auth (JWT later)
                      </h3>
                      <Alert variant="secondary">
                        Planned:
                        <div style={{ marginTop: 8 }}>
                          <div><code>POST /api/auth/register</code></div>
                          <div><code>POST /api/auth/login</code></div>
                          <div><code>POST /api/auth/refresh</code></div>
                        </div>
                      </Alert>

                      <Card bg="dark" text="light" style={{ border: '1px solid rgba(255,255,255,0.10)' }}>
                        <Card.Body>
                          <Card.Title style={{ fontSize: '1rem' }}>Request header</Card.Title>
                          <Card.Text style={{ opacity: 0.9, marginBottom: 8 }}>
                            Private endpoints will require:
                          </Card.Text>
                          <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                            Authorization: Bearer {'<access_token>'}
                          </pre>
                        </Card.Body>
                      </Card>
                    </div>
                  </Col>
                </Row>
              </Tab>
            </Tabs>
          </Reveal>
        </section>
      </Container>

      {/* Food search modal (NOW WORKS) */}
      <Modal show={showFoodSearchModal} onHide={() => setShowFoodSearchModal(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Search food (USDA)</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="secondary" className="mb-3">
            This calls backend endpoint <code>/api/foods/search/?q=...</code>. Make sure <code>USDA_API_KEY</code> is set on the server.
          </Alert>

          <InputGroup className="mb-3">
            <Form.Control
              value={foodSearchForm.query}
              onChange={(e) => setFoodSearchForm((p) => ({ ...p, query: e.target.value }))}
              placeholder="e.g. banana"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  runFoodSearch()
                }
              }}
            />
            <Button variant="info" onClick={runFoodSearch} disabled={foodLoading || !foodSearchForm.query.trim()}>
              {foodLoading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Searching
                </>
              ) : (
                'Search'
              )}
            </Button>
          </InputGroup>

          {foodError && <Alert variant="danger">{foodError}</Alert>}

          <Table bordered hover responsive size="sm">
            <thead>
              <tr>
                <th>Description</th>
                <th>Brand</th>
                <th>Type</th>
                <th style={{ width: 110 }}>FDC ID</th>
              </tr>
            </thead>
            <tbody>
              {foodResults.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ opacity: 0.8 }}>
                    {foodLoading ? 'Loading…' : 'No results yet.'}
                  </td>
                </tr>
              ) : (
                foodResults.map((f) => (
                  <tr key={String(f.fdcId)}>
                    <td>{f.description || '-'}</td>
                    <td>{f.brandOwner || '-'}</td>
                    <td>{f.dataType || '-'}</td>
                    <td>{f.fdcId}</td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowFoodSearchModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add meal modal (kept working as local mock) */}
      <Modal show={showMealModal} onHide={() => setShowMealModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add meal</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="secondary" className="mb-3">
            Mock form. Later you’ll build meal items from selected <code>Food</code> records (USDA cache).
          </Alert>

          <Form>
            <Row className="g-3">
              <Col sm={12}>
                <Form.Group>
                  <Form.Label>Calories</Form.Label>
                  <Form.Control
                    type="number"
                    inputMode="numeric"
                    value={mealForm.calories}
                    onChange={(e) => setMealForm((p) => ({ ...p, calories: e.target.value }))}
                    placeholder="e.g. 650"
                  />
                </Form.Group>
              </Col>
              <Col sm={4}>
                <Form.Group>
                  <Form.Label>Protein</Form.Label>
                  <Form.Control
                    type="number"
                    inputMode="numeric"
                    value={mealForm.protein}
                    onChange={(e) => setMealForm((p) => ({ ...p, protein: e.target.value }))}
                    placeholder="g"
                  />
                </Form.Group>
              </Col>
              <Col sm={4}>
                <Form.Group>
                  <Form.Label>Fat</Form.Label>
                  <Form.Control
                    type="number"
                    inputMode="numeric"
                    value={mealForm.fat}
                    onChange={(e) => setMealForm((p) => ({ ...p, fat: e.target.value }))}
                    placeholder="g"
                  />
                </Form.Group>
              </Col>
              <Col sm={4}>
                <Form.Group>
                  <Form.Label>Carbs</Form.Label>
                  <Form.Control
                    type="number"
                    inputMode="numeric"
                    value={mealForm.carbs}
                    onChange={(e) => setMealForm((p) => ({ ...p, carbs: e.target.value }))}
                    placeholder="g"
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowMealModal(false)}>
            Cancel
          </Button>
          <Button variant="info" onClick={addMeal}>
            Save (mock)
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add workout modal (kept working as local mock) */}
      <Modal show={showWorkoutModal} onHide={() => setShowWorkoutModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add workout</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="secondary" className="mb-3">
            Mock form. Later this will call <code>POST /api/activities/</code>.
          </Alert>

          <Form>
            <Row className="g-3">
              <Col sm={12}>
                <Form.Group>
                  <Form.Label>Workout type</Form.Label>
                  <Form.Control
                    value={workoutForm.type}
                    onChange={(e) => setWorkoutForm((p) => ({ ...p, type: e.target.value }))}
                    placeholder="e.g. Running"
                  />
                </Form.Group>
              </Col>
              <Col sm={6}>
                <Form.Group>
                  <Form.Label>Calories burned</Form.Label>
                  <Form.Control
                    type="number"
                    inputMode="numeric"
                    value={workoutForm.caloriesBurned}
                    onChange={(e) => setWorkoutForm((p) => ({ ...p, caloriesBurned: e.target.value }))}
                    placeholder="e.g. 320"
                  />
                </Form.Group>
              </Col>
              <Col sm={6}>
                <Form.Group>
                  <Form.Label>Minutes</Form.Label>
                  <Form.Control
                    type="number"
                    inputMode="numeric"
                    value={workoutForm.minutes}
                    onChange={(e) => setWorkoutForm((p) => ({ ...p, minutes: e.target.value }))}
                    placeholder="e.g. 45"
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowWorkoutModal(false)}>
            Cancel
          </Button>
          <Button variant="info" onClick={addWorkout}>
            Save (mock)
          </Button>
        </Modal.Footer>
      </Modal>
    </main>
  )
}

export default AutorizedPage
