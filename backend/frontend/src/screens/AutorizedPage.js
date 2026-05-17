import React, { useCallback, useEffect, useMemo, useState } from 'react'

import { Container, Tabs, Tab, Button, Alert, Spinner } from 'react-bootstrap'

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

import { dayKey, lastNDaysLabels, rangeLabels, sumNumber } from '../components/AutorizedComp/utils/dateUtils'
import {
  centerPercentPlugin,
  commonOptionsDark,
  donutOptionsDark,
  progressDonutOptionsDark,
} from '../components/AutorizedComp/utils/chartOptions'

import DashboardTab from '../components/AutorizedComp/tabs/DashboardTab'
import FoodsTab from '../components/AutorizedComp/tabs/FoodsTab'
import MealsTab from '../components/AutorizedComp/tabs/MealsTab'
import ActivitiesTab from '../components/AutorizedComp/tabs/ActivitiesTab'
import AnalyticsTab from '../components/AutorizedComp/tabs/AnalyticsTab'
import ProfileTab from '../components/AutorizedComp/tabs/ProfileTab'
import MyFoodsTab, { EditFoodModal } from '../components/AutorizedComp/tabs/MyFoodsTab'
import { useI18n } from '../i18n'

import {
  logout as apiLogout,
  getMe,
  patchMe,
  listMeals,
  createMeal,
  deleteMeal,
  listActivities,
  createActivity,
  deleteActivity,
  searchUsdaFoods,
  importUsdaFood,
  createCustomFood,
  listFoods,
  patchFood,
  deleteFood,
} from '../api/client'

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
  const { t, locale, language } = useI18n()

  // Auth + user
  const [me, setMe] = useState(null)
  const [bootLoading, setBootLoading] = useState(true)
  const [bootError, setBootError] = useState('')

  // meals/workouts (mapped for charts)
  const [meals, setMeals] = useState([]) // { id, dateKey, calories, protein, fat, carbs }
  const [workouts, setWorkouts] = useState([]) // { id, dateKey, caloriesBurned, minutes, type }

  // UI state
  const [activeTab, setActiveTab] = useState('dashboard')

  // Modals
  const [showMealModal, setShowMealModal] = useState(false)
  const [showWorkoutModal, setShowWorkoutModal] = useState(false)
  const [showFoodSearchModal, setShowFoodSearchModal] = useState(false)

  // Meal draft
  const [mealItems, setMealItems] = useState([])
  const [mealNote, setMealNote] = useState('')
  const [mealEatenAt, setMealEatenAt] = useState('')
  const [mealSaving, setMealSaving] = useState(false)
  const [mealError, setMealError] = useState('')
  const [customFoodDraft, setCustomFoodDraft] = useState({
    name: '',
    brand: '',
    kcal_per_100g: '',
    protein_per_100g: '',
    fat_per_100g: '',
    carbs_per_100g: '',
  })
  const [customFoodSaving, setCustomFoodSaving] = useState(false)

  const [workoutForm, setWorkoutForm] = useState({
    type: '',
    caloriesBurned: '',
    minutes: '',
  })
  const [workoutSaving, setWorkoutSaving] = useState(false)
  const [workoutError, setWorkoutError] = useState('')
  const [workoutStartedAt, setWorkoutStartedAt] = useState('')
  const [deletingMealId, setDeletingMealId] = useState('')
  const [deletingWorkoutId, setDeletingWorkoutId] = useState('')
  const [profileSaving, setProfileSaving] = useState(false)
  const [profileError, setProfileError] = useState('')

  const [foodSearchForm, setFoodSearchForm] = useState({
    query: '',
  })

  const [analyticsForm, setAnalyticsForm] = useState({
    from: '',
    to: '',
    groupBy: 'day',
  })
  const [analyticsApplying, setAnalyticsApplying] = useState(false)
  const [analyticsError, setAnalyticsError] = useState('')
  const [analyticsSummary, setAnalyticsSummary] = useState(null)

  const [foodLoading, setFoodLoading] = useState(false)
  const [foodError, setFoodError] = useState('')
  const [foodResults, setFoodResults] = useState([])
  const [importingFoodId, setImportingFoodId] = useState('')
  const [pickingFoodId, setPickingFoodId] = useState('')
  const [addingFoodId, setAddingFoodId] = useState('')

  const [myFoodsQuery, setMyFoodsQuery] = useState('')
  const [myFoodsLoading, setMyFoodsLoading] = useState(false)
  const [myFoodsError, setMyFoodsError] = useState('')
  const [myFoods, setMyFoods] = useState([])
  const [editFood, setEditFood] = useState(null)
  const [editFoodOpen, setEditFoodOpen] = useState(false)
  const [editFoodSaving, setEditFoodSaving] = useState(false)
  const [editFoodError, setEditFoodError] = useState('')

  function mapMeal(m) {
    const totals = m?.totals || {}
    return {
      id: m.id,
      eatenAt: m.eaten_at,
      dateKey: dayKey(new Date(m.eaten_at)),
      calories: sumNumber(totals.kcal),
      protein: sumNumber(totals.protein),
      fat: sumNumber(totals.fat),
      carbs: sumNumber(totals.carbs),
    }
  }

  function mapWorkout(w) {
    const totals = w?.totals || {}
    const first = Array.isArray(w.entries) && w.entries.length > 0 ? w.entries[0] : null
    return {
      id: w.id,
      startedAt: w.started_at,
      dateKey: dayKey(new Date(w.started_at)),
      type: first?.name_snapshot || t('workout'),
      minutes: sumNumber(totals.minutes || w.duration_minutes),
      caloriesBurned: sumNumber(totals.kcal || w.total_kcal_burned),
    }
  }

  async function bootstrap() {
    setBootError('')
    setBootLoading(true)
    try {
      const token = localStorage.getItem('authToken')
      if (!token) {
        setMe(null)
        setMeals([])
        setWorkouts([])
        return
      }
      const meData = await getMe()
      setMe(meData)
      const [mealsData, workoutsData, myFoodsData] = await Promise.all([
        listMeals(),
        listActivities(),
        listFoods({ source: 'custom' }),
      ])
      setMeals(Array.isArray(mealsData) ? mealsData.map(mapMeal) : [])
      setWorkouts(Array.isArray(workoutsData) ? workoutsData.map(mapWorkout) : [])
      setMyFoods(Array.isArray(myFoodsData) ? myFoodsData : [])
    } catch (e) {
      const msg = e?.response?.data?.detail || e?.message || t('failedLoadUserData')
      setBootError(msg)
      // 401/403 -> clear token to avoid infinite loops
      if (e?.response?.status === 401 || e?.response?.status === 403) {
        apiLogout()
        setMe(null)
      }
    } finally {
      setBootLoading(false)
    }
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const tab = params.get('tab')
    if (tab) setActiveTab(tab)
    bootstrap()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function runFoodSearch() {
    const q = foodSearchForm.query.trim()
    if (!q) return

    setFoodError('')
    setFoodLoading(true)
    try {
      const data = await searchUsdaFoods(q, 10)
      setFoodResults(Array.isArray(data?.foods) ? data.foods : [])
    } catch (e) {
      setFoodResults([])
      setFoodError(e?.response?.data?.detail || e?.message || t('searchFailed'))
    } finally {
      setFoodLoading(false)
    }
  }

  const hasData = meals.length > 0 || workouts.length > 0

  const weekStartKey = useCallback((dateKeyStr) => {
    const d = new Date(`${dateKeyStr}T00:00:00`)
    const day = d.getDay() || 7
    d.setDate(d.getDate() - (day - 1))
    return dayKey(d)
  }, [])

  const toGroupKey = useCallback((dateKeyStr, groupBy) => {
    if (groupBy === 'month') return String(dateKeyStr).slice(0, 7)
    if (groupBy === 'week') return weekStartKey(dateKeyStr)
    return dateKeyStr
  }, [weekStartKey])

  function autoGroupBy(fromDate, toDate) {
    const days = Math.max(1, Math.round((toDate - fromDate) / (1000 * 60 * 60 * 24)))
    if (days > 180) return 'month'
    if (days > 45) return 'week'
    return 'day'
  }

  const dashboardRange = useMemo(() => {
    const to = new Date()
    const firstMeal = meals.length ? meals[meals.length - 1] : null
    const firstWorkout = workouts.length ? workouts[workouts.length - 1] : null

    // meals/workouts are stored newest-first; last element is the earliest in our current list
    const candidates = []
    if (firstMeal?.eatenAt) candidates.push(new Date(firstMeal.eatenAt))
    if (firstWorkout?.startedAt) candidates.push(new Date(firstWorkout.startedAt))

    let from = null
    for (const d of candidates) {
      if (Number.isNaN(d.getTime())) continue
      if (!from || d < from) from = d
    }

    // If no data yet, keep a sensible default so charts don't break
    if (!from) {
      const { labels, keys } = lastNDaysLabels(7, locale)
      return { from: null, to, groupBy: 'day', labels, keys }
    }

    const groupBy = autoGroupBy(from, to)
    const { labels, keys } = rangeLabels(from, to, groupBy, locale)
    return { from, to, groupBy, labels, keys }
  }, [locale, meals, workouts])

  const dataByDay = useMemo(() => {
    const groupBy = dashboardRange.groupBy
    const keys = dashboardRange.keys
    const caloriesInMap = Object.fromEntries(keys.map((k) => [k, 0]))
    const caloriesOutMap = Object.fromEntries(keys.map((k) => [k, 0]))

    for (const meal of meals) {
      const k = toGroupKey(meal?.dateKey, groupBy)
      if (k in caloriesInMap) caloriesInMap[k] += sumNumber(meal.calories)
    }
    for (const w of workouts) {
      const k = toGroupKey(w?.dateKey, groupBy)
      if (k in caloriesOutMap) caloriesOutMap[k] += sumNumber(w.caloriesBurned)
    }

    const caloriesIn = keys.map((k) => caloriesInMap[k] ?? 0)
    const caloriesOut = keys.map((k) => caloriesOutMap[k] ?? 0)
    const balance = keys.map((k) => (caloriesInMap[k] ?? 0) - (caloriesOutMap[k] ?? 0))

    return { caloriesIn, caloriesOut, balance }
  }, [dashboardRange.groupBy, dashboardRange.keys, meals, toGroupKey, workouts])

  const macros = useMemo(() => {
    const groupBy = dashboardRange.groupBy
    const allowed = new Set(dashboardRange.keys)
    let protein = 0
    let fat = 0
    let carbs = 0
    for (const meal of meals) {
      const k = toGroupKey(meal?.dateKey, groupBy)
      if (!allowed.has(k)) continue
      protein += sumNumber(meal.protein)
      fat += sumNumber(meal.fat)
      carbs += sumNumber(meal.carbs)
    }
    return { protein, fat, carbs }
  }, [dashboardRange.groupBy, dashboardRange.keys, meals, toGroupKey])

  const lineData = useMemo(() => {
    const series = hasData ? dataByDay.caloriesIn : dashboardRange.keys.map(() => 0)
    return {
      labels: dashboardRange.labels,
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
  }, [dataByDay.caloriesIn, dashboardRange.keys, dashboardRange.labels, hasData])

  const barData = useMemo(() => {
    const series = hasData ? dataByDay.caloriesOut : dashboardRange.keys.map(() => 0)
    return {
      labels: dashboardRange.labels,
      datasets: [
        {
          data: series,
          backgroundColor: 'rgba(11, 184, 203, 0.6)',
          borderRadius: 10,
        },
      ],
    }
  }, [dataByDay.caloriesOut, dashboardRange.keys, dashboardRange.labels, hasData])

  const burnProgressData = useMemo(() => {
    const consumed = dataByDay.caloriesIn.reduce((a, b) => a + sumNumber(b), 0)
    const burned = dataByDay.caloriesOut.reduce((a, b) => a + sumNumber(b), 0)
    if (!consumed) {
      return {
        labels: [t('caloriesBurned'), t('notSet')],
        datasets: [
          {
            data: [0, 100],
            backgroundColor: ['rgba(42, 161, 152, 0.65)', 'rgba(255,255,255,0.10)'],
            borderWidth: 0,
          },
        ],
      }
    }

    const ratio = burned / consumed
    const progress = Math.min(1, Math.max(0, ratio))
    const done = ratio >= 1
    const pct = Math.round(progress * 1000) / 10
    return {
      labels: [t('caloriesBurned'), t('notSet')],
      datasets: [
        {
          data: [pct, Math.max(0, 100 - pct)],
          backgroundColor: [done ? 'rgba(42, 161, 152, 0.85)' : 'rgba(11, 184, 203, 0.70)', 'rgba(255,255,255,0.10)'],
          borderWidth: 0,
        },
      ],
    }
  }, [dataByDay.caloriesIn, dataByDay.caloriesOut, t])

  const donutData = useMemo(() => {
    const p = hasData ? macros.protein : 0
    const f = hasData ? macros.fat : 0
    const c = hasData ? macros.carbs : 0
    return {
      labels: [t('protein'), t('fat'), t('carbs')],
      datasets: [
        {
          data: [p, f, c],
          backgroundColor: ['rgba(11, 184, 203, 0.6)', '#d4a20b', '#268bd2'],
          borderColor: 'rgba(255,255,255,0.85)',
          borderWidth: 1,
        },
      ],
    }
  }, [hasData, macros.carbs, macros.fat, macros.protein, t])

  const dashboardTotals = useMemo(() => {
    const kcalIn = dataByDay.caloriesIn.reduce((a, b) => a + sumNumber(b), 0)
    const kcalOut = dataByDay.caloriesOut.reduce((a, b) => a + sumNumber(b), 0)
    return {
      kcalIn,
      kcalOut,
      protein: macros.protein,
      fat: macros.fat,
      carbs: macros.carbs,
    }
  }, [dataByDay.caloriesIn, dataByDay.caloriesOut, macros.carbs, macros.fat, macros.protein])

  const analyticsRange = useMemo(() => {
    if (!analyticsForm.from && !analyticsForm.to) {
      const { labels, keys } = lastNDaysLabels(7, locale)
      return { labels, keys, groupBy: 'day' }
    }
    const from = analyticsForm.from ? new Date(`${analyticsForm.from}T00:00:00`) : new Date()
    const to = analyticsForm.to ? new Date(`${analyticsForm.to}T00:00:00`) : new Date()
    const { labels, keys } = rangeLabels(from, to, analyticsForm.groupBy || 'day', locale)
    return { labels, keys, groupBy: analyticsForm.groupBy || 'day' }
  }, [analyticsForm.from, analyticsForm.groupBy, analyticsForm.to, locale])

  const analyticsAgg = useMemo(() => {
    const groupBy = analyticsRange.groupBy
    const keys = analyticsRange.keys
    const inMap = Object.fromEntries(keys.map((k) => [k, 0]))
    const outMap = Object.fromEntries(keys.map((k) => [k, 0]))
    for (const meal of meals) {
      const k = toGroupKey(meal?.dateKey, groupBy)
      if (k in inMap) inMap[k] += sumNumber(meal.calories)
    }
    for (const w of workouts) {
      const k = toGroupKey(w?.dateKey, groupBy)
      if (k in outMap) outMap[k] += sumNumber(w.caloriesBurned)
    }
    const caloriesIn = keys.map((k) => inMap[k] ?? 0)
    const caloriesOut = keys.map((k) => outMap[k] ?? 0)
    const balance = keys.map((k) => (inMap[k] ?? 0) - (outMap[k] ?? 0))
    return { caloriesIn, caloriesOut, balance }
  }, [analyticsRange.groupBy, analyticsRange.keys, meals, toGroupKey, workouts])

  const analyticsLineData = useMemo(
    () => ({
      labels: analyticsRange.labels,
      datasets: [
        {
          data: analyticsAgg.caloriesIn,
          borderColor: 'rgba(255,255,255,0.92)',
          backgroundColor: 'rgba(11, 184, 203, 0.30)',
          tension: 0.3,
          pointRadius: 2,
          pointHoverRadius: 4,
          fill: true,
        },
      ],
    }),
    [analyticsAgg.caloriesIn, analyticsRange.labels]
  )

  const analyticsBarData = useMemo(
    () => ({
      labels: analyticsRange.labels,
      datasets: [
        {
          data: analyticsAgg.caloriesOut,
          backgroundColor: 'rgba(11, 184, 203, 0.6)',
          borderRadius: 10,
        },
      ],
    }),
    [analyticsAgg.caloriesOut, analyticsRange.labels]
  )

  const analyticsBurnProgressData = useMemo(() => {
    const consumed = analyticsAgg.caloriesIn.reduce((a, b) => a + sumNumber(b), 0)
    const burned = analyticsAgg.caloriesOut.reduce((a, b) => a + sumNumber(b), 0)
    if (!consumed) {
      return {
        labels: [t('caloriesBurned'), t('notSet')],
        datasets: [
          {
            data: [0, 100],
            backgroundColor: ['rgba(42, 161, 152, 0.65)', 'rgba(255,255,255,0.10)'],
            borderWidth: 0,
          },
        ],
      }
    }

    const ratio = burned / consumed
    const progress = Math.min(1, Math.max(0, ratio))
    const done = ratio >= 1
    const pct = Math.round(progress * 1000) / 10
    return {
      labels: [t('caloriesBurned'), t('notSet')],
      datasets: [
        {
          data: [pct, Math.max(0, 100 - pct)],
          backgroundColor: [done ? 'rgba(42, 161, 152, 0.85)' : 'rgba(11, 184, 203, 0.70)', 'rgba(255,255,255,0.10)'],
          borderWidth: 0,
        },
      ],
    }
  }, [analyticsAgg.caloriesIn, analyticsAgg.caloriesOut, t])

  const analyticsDonutData = useMemo(() => {
    const allowed = new Set(analyticsRange.keys)
    const groupBy = analyticsRange.groupBy
    let protein = 0
    let fat = 0
    let carbs = 0
    for (const meal of meals) {
      const k = toGroupKey(meal?.dateKey, groupBy)
      if (!allowed.has(k)) continue
      protein += sumNumber(meal.protein)
      fat += sumNumber(meal.fat)
      carbs += sumNumber(meal.carbs)
    }
    return {
      labels: [t('protein'), t('fat'), t('carbs')],
      datasets: [
        {
          data: [protein, fat, carbs],
          backgroundColor: ['rgba(11, 184, 203, 0.6)', '#d4a20b', '#268bd2'],
          borderColor: 'rgba(255,255,255,0.85)',
          borderWidth: 1,
        },
      ],
    }
  }, [analyticsRange.groupBy, analyticsRange.keys, meals, t, toGroupKey])

  async function handlePickFoodForMeal(f) {
    if (!f?.fdcId) return
    setMealError('')
    // used from both modal + tab
    setPickingFoodId(String(f.fdcId))
    setAddingFoodId(String(f.fdcId))
    try {
      const food = await importUsdaFood(f.fdcId)
      const kcal100 = sumNumber(food.kcal_per_100g)
      const p100 = sumNumber(food.protein_per_100g)
      const f100 = sumNumber(food.fat_per_100g)
      const c100 = sumNumber(food.carbs_per_100g)
      if (!kcal100 && !p100 && !f100 && !c100) {
        throw new Error(t('noNutritionData'))
      }
      const grams = 100
      const factor = grams / 100
      setMealItems((prev) => [
        ...prev,
        {
          food_id: food.id,
          name_snapshot: food.name,
          grams: String(grams),
          kcal_per_100g: kcal100,
          protein_per_100g: p100,
          fat_per_100g: f100,
          carbs_per_100g: c100,
          kcal_total: kcal100 * factor,
          protein_total: p100 * factor,
          fat_total: f100 * factor,
          carbs_total: c100 * factor,
        },
      ])
      if (!mealEatenAt) {
        const now = new Date()
        setMealEatenAt(now.toISOString().slice(0, 16))
      }
      setShowMealModal(true)
      setShowFoodSearchModal(false)
    } catch (e) {
      setMealError(e?.response?.data?.detail || e?.message || t('failedAddFood'))
    } finally {
      setPickingFoodId('')
      setAddingFoodId('')
    }
  }

  async function handleImportFood(f) {
    if (!f?.fdcId) return
    setFoodError('')
    setImportingFoodId(String(f.fdcId))
    try {
      await importUsdaFood(f.fdcId)
      // mark cached locally
      setFoodResults((prev) => prev.map((p) => (String(p.fdcId) === String(f.fdcId) ? { ...p, cached: true } : p)))
    } catch (e) {
      setFoodError(e?.response?.data?.detail || e?.message || t('importFailed'))
    } finally {
      setImportingFoodId('')
    }
  }

  async function loadMyFoods() {
    setMyFoodsError('')
    setMyFoodsLoading(true)
    try {
      const data = await listFoods({ source: 'custom', search: myFoodsQuery.trim() || undefined })
      setMyFoods(Array.isArray(data) ? data : [])
    } catch (e) {
      setMyFoodsError(e?.response?.data?.detail || e?.message || t('failedLoadFoods'))
    } finally {
      setMyFoodsLoading(false)
    }
  }

  async function addMeal() {
    if (mealItems.length === 0) return
    setMealError('')
    setMealSaving(true)
    try {
      const eatenAtIso = mealEatenAt ? new Date(mealEatenAt).toISOString() : new Date().toISOString()
      const payload = {
        eaten_at: eatenAtIso,
        note: mealNote || null,
        items: mealItems.map((it) => ({
          food_id: it.food_id,
          name_snapshot: it.name_snapshot,
          grams: Number(it.grams || 0),
          kcal_total: sumNumber(it.kcal_total),
          protein_total: sumNumber(it.protein_total),
          fat_total: sumNumber(it.fat_total),
          carbs_total: sumNumber(it.carbs_total),
        })),
      }
      const created = await createMeal(payload)
      setMeals((prev) => [mapMeal(created), ...prev])
      setMealItems([])
      setMealNote('')
      setMealEatenAt('')
      setShowMealModal(false)
    } catch (e) {
      setMealError(e?.response?.data?.detail || e?.message || t('failedSaveMeal'))
    } finally {
      setMealSaving(false)
    }
  }

  async function addCustomFoodToMeal() {
    const name = customFoodDraft.name.trim()
    if (!name) return
    setMealError('')
    setCustomFoodSaving(true)
    try {
      const food = await createCustomFood({
        source: 'custom',
        name,
        brand: customFoodDraft.brand.trim() || null,
        kcal_per_100g: customFoodDraft.kcal_per_100g === '' ? null : Number(customFoodDraft.kcal_per_100g),
        protein_per_100g: customFoodDraft.protein_per_100g === '' ? null : Number(customFoodDraft.protein_per_100g),
        fat_per_100g: customFoodDraft.fat_per_100g === '' ? null : Number(customFoodDraft.fat_per_100g),
        carbs_per_100g: customFoodDraft.carbs_per_100g === '' ? null : Number(customFoodDraft.carbs_per_100g),
      })
      const grams = 100
      const factor = grams / 100
      setMealItems((prev) => [
        ...prev,
        {
          food_id: food.id,
          name_snapshot: food.name,
          grams: String(grams),
          kcal_per_100g: sumNumber(food.kcal_per_100g),
          protein_per_100g: sumNumber(food.protein_per_100g),
          fat_per_100g: sumNumber(food.fat_per_100g),
          carbs_per_100g: sumNumber(food.carbs_per_100g),
          kcal_total: sumNumber(food.kcal_per_100g) * factor,
          protein_total: sumNumber(food.protein_per_100g) * factor,
          fat_total: sumNumber(food.fat_per_100g) * factor,
          carbs_total: sumNumber(food.carbs_per_100g) * factor,
        },
      ])
      setMyFoods((prev) => [food, ...prev])
      setCustomFoodDraft({
        name: '',
        brand: '',
        kcal_per_100g: '',
        protein_per_100g: '',
        fat_per_100g: '',
        carbs_per_100g: '',
      })
      if (!mealEatenAt) {
        const now = new Date()
        setMealEatenAt(now.toISOString().slice(0, 16))
      }
      setShowMealModal(true)
    } catch (e) {
      setMealError(e?.response?.data?.detail || e?.message || t('failedCreateCustomFood'))
    } finally {
      setCustomFoodSaving(false)
    }
  }

  async function addWorkout() {
    setWorkoutError('')
    setWorkoutSaving(true)
    try {
      const type = String(workoutForm.type || '').trim() || t('workout')
      const minutes = sumNumber(workoutForm.minutes)
      const kcal = sumNumber(workoutForm.caloriesBurned)
      const startedAtIso = workoutStartedAt ? new Date(workoutStartedAt).toISOString() : new Date().toISOString()
      const created = await createActivity({
        started_at: startedAtIso,
        duration_minutes: minutes,
        total_kcal_burned: kcal,
        note: null,
        entries: [
          {
            name_snapshot: type,
            minutes,
            kcal_burned: kcal,
          },
        ],
      })
      setWorkouts((prev) => [mapWorkout(created), ...prev])
      setWorkoutForm({ type: '', caloriesBurned: '', minutes: '' })
      setWorkoutStartedAt('')
      setShowWorkoutModal(false)
    } catch (e) {
      setWorkoutError(e?.response?.data?.detail || e?.message || t('failedSaveWorkout'))
    } finally {
      setWorkoutSaving(false)
    }
  }

  async function handleDeleteMeal(id) {
    const sid = String(id)
    setDeletingMealId(sid)
    try {
      await deleteMeal(id)
      setMeals((prev) => prev.filter((m) => String(m.id) !== sid))
    } catch (e) {

    } finally {
      setDeletingMealId('')
    }
  }

  async function handleDeleteWorkout(id) {
    const sid = String(id)
    setDeletingWorkoutId(sid)
    try {
      await deleteActivity(id)
      setWorkouts((prev) => prev.filter((w) => String(w.id) !== sid))
    } catch (e) {
      // silent for now
    } finally {
      setDeletingWorkoutId('')
    }
  }

  async function handleSaveProfile(payload) {
    setProfileError('')
    setProfileSaving(true)
    try {
      const updated = await patchMe(payload)
      setMe(updated)
      return updated
    } catch (e) {
      setProfileError(e?.response?.data?.detail || e?.message || t('failedSaveProfile'))
      throw e
    } finally {
      setProfileSaving(false)
    }
  }

  async function applyAnalytics() {
    setAnalyticsError('')
    setAnalyticsApplying(true)
    try {
      // computed from current range buckets
      const sum = {
        kcalIn: analyticsAgg.caloriesIn.reduce((a, b) => a + sumNumber(b), 0),
        kcalOut: analyticsAgg.caloriesOut.reduce((a, b) => a + sumNumber(b), 0),
        protein: analyticsDonutData.datasets?.[0]?.data?.[0] || 0,
        fat: analyticsDonutData.datasets?.[0]?.data?.[1] || 0,
        carbs: analyticsDonutData.datasets?.[0]?.data?.[2] || 0,
      }
      setAnalyticsSummary(sum)
    } catch (e) {
      setAnalyticsError(e?.message || t('chooseCorrectRange'))
    } finally {
      setAnalyticsApplying(false)
    }
  }

  if (bootLoading) {
    return (
      <main className="app-shell">
        <Container>
          <div className="section section-dark" style={{ padding: 24 }}>
            <Spinner animation="border" role="status" />
          </div>
        </Container>
      </main>
    )
  }

  if (!localStorage.getItem('authToken') || !me) {
    return (
      <main className="app-shell">
        <Container>
          <section className="section section-dark" style={{ padding: 24 }}>
            <Reveal>
              <h2 className="section-title">{t('login')}</h2>
              <Button variant="info" href="/login">{t('login')}</Button>
            </Reveal>
          </section>
        </Container>
      </main>
    )
  }

  return (
    <main className="app-shell">
      <Container>
        {bootError && <Alert variant="danger">{bootError}</Alert>}
        <MainButtons
          onOpenFoodSearch={() => setShowFoodSearchModal(true)}
          onOpenMeal={() => {
            setMealItems([])
            setMealNote('')
            setMealError('')
            const now = new Date()
            setMealEatenAt(now.toISOString().slice(0, 16))
            setShowMealModal(true)
          }}
          onOpenWorkout={() => {
            const now = new Date()
            setWorkoutStartedAt(now.toISOString().slice(0, 16))
            setShowWorkoutModal(true)
          }}
        />
        <section className="section section-dark">
          <Reveal>
            <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k || 'dashboard')} className="mb-3">
              <Tab eventKey="dashboard" title={t('dashboard')}>
                <DashboardTab
                    hasData={hasData}
                    dataByDay={dataByDay}
                    macros={macros}
                    totals={dashboardTotals}
                    lineData={lineData}
                    barData={barData}
                    donutData={donutData}
                    burnProgressData={burnProgressData}
                    rangeLabel={dashboardRange.from ? `${dayKey(dashboardRange.from)} - ${new Date().toLocaleDateString(locale)}` : ''}
                    commonOptionsDark={commonOptionsDark}
                    donutOptionsDark={donutOptionsDark}
                    progressDonutOptionsDark={progressDonutOptionsDark}
                    centerPercentPlugin={centerPercentPlugin}
                />
              </Tab>

              <Tab eventKey="foods" title={t('foodSearch')}>
                <FoodsTab
                    query={foodSearchForm.query}
                    setQuery={(value) => setFoodSearchForm((p) => ({ ...p, query: value }))}
                    onSearch={runFoodSearch}
                    loading={foodLoading}
                    error={foodError}
                    results={foodResults}
                    onImport={handleImportFood}
                    importingId={importingFoodId}
                    onAddToMeal={handlePickFoodForMeal}
                    addingId={addingFoodId}
                />
              </Tab>

              <Tab eventKey="myfoods" title={t('myFoods')}>
                <MyFoodsTab
                  query={myFoodsQuery}
                  setQuery={setMyFoodsQuery}
                  onSearch={loadMyFoods}
                  loading={myFoodsLoading}
                  error={myFoodsError}
                  foods={myFoods}
                  onEdit={(f) => {
                    setEditFoodError('')
                    setEditFood(f)
                    setEditFoodOpen(true)
                  }}
                />
              </Tab>

              <Tab eventKey="meals" title={t('meals')}>
                <MealsTab
                    meals={meals}
                    onOpenMealModal={() => setShowMealModal(true)}
                    onDeleteMeal={handleDeleteMeal}
                    deletingId={deletingMealId}
                />
              </Tab>
              <Tab eventKey="activities" title={t('activities')}>
                <ActivitiesTab
                    workouts={workouts}
                    onOpenWorkoutModal={() => setShowWorkoutModal(true)}
                    onDeleteWorkout={handleDeleteWorkout}
                    deletingId={deletingWorkoutId}
                />
              </Tab>

              <Tab eventKey="analytics" title={t('analytics')}>
                <AnalyticsTab
                  analyticsForm={analyticsForm}
                  setAnalyticsForm={setAnalyticsForm}
                  onApply={applyAnalytics}
                  summary={analyticsSummary}
                  applying={analyticsApplying}
                  error={analyticsError}
                  lineData={analyticsLineData}
                  barData={analyticsBarData}
                  donutData={analyticsDonutData}
                  burnProgressData={analyticsBurnProgressData}
                  commonOptionsDark={commonOptionsDark}
                  donutOptionsDark={donutOptionsDark}
                  progressDonutOptionsDark={progressDonutOptionsDark}
                  centerPercentPlugin={centerPercentPlugin}
                />
              </Tab>

              <Tab eventKey="profile" title={t('profile')}>
                <ProfileTab
                  me={me}
                  onSave={async (payload) => {
                    try {
                      await handleSaveProfile(payload)
                    } catch (e) {
                      // handled in tab
                    }
                  }}
                  saving={profileSaving}
                  saveError={profileError}
                  language={language}
                  locale={locale}
                />
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
        onPickFood={handlePickFoodForMeal}
        pickingId={pickingFoodId}
      />

      <MealModal
        show={showMealModal}
        onHide={() => setShowMealModal(false)}
        items={mealItems}
        setItems={setMealItems}
        note={mealNote}
        setNote={setMealNote}
        eatenAt={mealEatenAt}
        setEatenAt={setMealEatenAt}
        onAddFood={() => setShowFoodSearchModal(true)}
        customFoodDraft={customFoodDraft}
        setCustomFoodDraft={setCustomFoodDraft}
        onCreateCustomFood={addCustomFoodToMeal}
        creatingCustomFood={customFoodSaving}
        onSave={addMeal}
        saving={mealSaving}
        error={mealError}
      />

      <WorkoutModal
        show={showWorkoutModal}
        onHide={() => setShowWorkoutModal(false)}
        workoutForm={workoutForm}
        setWorkoutForm={setWorkoutForm}
        startedAt={workoutStartedAt}
        setStartedAt={setWorkoutStartedAt}
        onSave={addWorkout}
        saving={workoutSaving}
        error={workoutError}
      />

      <EditFoodModal
        show={editFoodOpen}
        onHide={() => setEditFoodOpen(false)}
        food={editFood}
        saving={editFoodSaving}
        error={editFoodError}
        onSave={async (food, payload) => {
          setEditFoodError('')
          setEditFoodSaving(true)
          try {
            const updated = await patchFood(food.id, payload)
            setMyFoods((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
            setEditFood(updated)
            setEditFoodOpen(false)
          } catch (e) {
            setEditFoodError(e?.response?.data?.detail || e?.message || t('failedSaveProfile'))
          } finally {
            setEditFoodSaving(false)
          }
        }}
        onDelete={async (food) => {
          setEditFoodError('')
          setEditFoodSaving(true)
          try {
            await deleteFood(food.id)
            setMyFoods((prev) => prev.filter((p) => p.id !== food.id))
            setEditFoodOpen(false)
          } catch (e) {
            setEditFoodError(e?.response?.data?.detail || e?.message || t('failedLoadFoods'))
          } finally {
            setEditFoodSaving(false)
          }
        }}
      />
    </main>
  )
}

export default AutorizedPage
