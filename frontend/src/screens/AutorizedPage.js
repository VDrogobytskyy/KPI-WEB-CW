import React, { useMemo, useState } from 'react'

import { Container, Tabs, Tab } from 'react-bootstrap'

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

import Reveal from '../components/Reveal'
import MainButtons from '../components/AutorizedComp/MainButtons'
import FoodSearchModal from '../components/AutorizedComp/FoodSearchModal'
import MealModal from '../components/AutorizedComp/MealModal'
import WorkoutModal from '../components/AutorizedComp/WorkoutModal'

import { dayKey, lastNDaysLabels, sumNumber } from '../components/AutorizedComp/utils/dateUtils'
import { commonOptionsDark, donutOptionsDark } from '../components/AutorizedComp/utils/chartOptions'

import DashboardTab from '../components/AutorizedComp/tabs/DashboardTab'
import FoodsTab from '../components/AutorizedComp/tabs/FoodsTab'
import MealsTab from '../components/AutorizedComp/tabs/MealsTab'
import ActivitiesTab from '../components/AutorizedComp/tabs/ActivitiesTab'
import AnalyticsTab from '../components/AutorizedComp/tabs/AnalyticsTab'
import ProfileTab from '../components/AutorizedComp/tabs/ProfileTab'


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

function AutorizedPage() {
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
        <MainButtons     
            onOpenFoodSearch={() => setShowFoodSearchModal(true)}
            onOpenMeal={() => setShowMealModal(true)}
            onOpenWorkout={() => setShowWorkoutModal(true)}
        />
        <section className="section section-dark">
          <Reveal>
            <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k || 'dashboard')} className="mb-3">
              <Tab eventKey="dashboard" title="Dashboard">
                <DashboardTab
                    hasData={hasData}
                    dataByDay={dataByDay}
                    macros={macros}
                    lineData={lineData}
                    barData={barData}
                    donutData={donutData}
                    commonOptionsDark={commonOptionsDark}
                    donutOptionsDark={donutOptionsDark}
                />
              </Tab>

              <Tab eventKey="foods" title="Foods (USDA)">
                <FoodsTab
                    query={foodSearchForm.query}
                    setQuery={(value) => setFoodSearchForm((p) => ({ ...p, query: value }))}
                    onSearch={runFoodSearch}
                    loading={foodLoading}
                    error={foodError}
                    results={foodResults}
                />
              </Tab>

              <Tab eventKey="meals" title="Meals">
                <MealsTab
                    meals={meals}
                    onOpenMealModal={() => setShowMealModal(true)}
                />
              </Tab>
              <Tab eventKey="activities" title="Activities">
                <ActivitiesTab
                    workouts={workouts}
                    onOpenWorkoutModal={() => setShowWorkoutModal(true)}
                />
              </Tab>

              <Tab eventKey="analytics" title="Analytics">
                <AnalyticsTab analyticsForm={analyticsForm} setAnalyticsForm={setAnalyticsForm} />
              </Tab>

              <Tab eventKey="profile" title="Profile">
                <ProfileTab />
              </Tab>

            </Tabs>
          </Reveal>
        </section>
      </Container>

      <FoodSearchModal
        show={showFoodSearchModal}
        onHide={() => setShowFoodSearchModal(false)}
        query={foodSearchForm.query}
        setQuery={(value) => setFoodSearchForm((p) => ({ ...p, query: value }))}
        onSearch={runFoodSearch}
        loading={foodLoading}
        error={foodError}
        results={foodResults}
      />

      <MealModal
        show={showMealModal}
        onHide={() => setShowMealModal(false)}
        mealForm={mealForm}
        setMealForm={setMealForm}
        onSave={addMeal}
      />

      <WorkoutModal
        show={showWorkoutModal}
        onHide={() => setShowWorkoutModal(false)}
        workoutForm={workoutForm}
        setWorkoutForm={setWorkoutForm}
        onSave={addWorkout}
      />
    </main>
  )
}

export default AutorizedPage
