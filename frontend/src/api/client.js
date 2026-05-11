import axios from 'axios'
import { emitAuthTokenChanged } from '../auth/tokenStore'

const api = axios.create({
  baseURL: '/api',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export async function login(username, password) {
  const { data } = await api.post('/users/login/', { username, password })
  // backend returns { access, refresh, ...userFields }
  const token = data?.access || data?.token
  if (!token) throw new Error('No access token in response')
  localStorage.setItem('authToken', token)
  emitAuthTokenChanged()
  return data
}

export function logout() {
  localStorage.removeItem('authToken')
  emitAuthTokenChanged()
}

export async function register({ username, email, password }) {
  const { data } = await api.post('/users/register/', { username, email, password })
  const token = data?.access || data?.token
  if (token) {
    localStorage.setItem('authToken', token)
    emitAuthTokenChanged()
  }
  return data
}

export async function getMe() {
  const { data } = await api.get('/users/profile/')
  return data
}

export async function patchMe(payload) {
  const { data } = await api.patch('/users/profile/', payload)
  return data
}

export async function searchUsdaFoods(q, pageSize = 10) {
  const { data } = await api.get('/foods/search/', {
    params: { q, pageSize },
  })
  return data
}

export async function importUsdaFood(fdcId) {
  const { data } = await api.post('/foods/import/', { fdcId })
  return data
}

export async function listCachedFoods(search = '') {
  const { data } = await api.get('/foods/', { params: search ? { search } : {} })
  return data
}

export async function listFoods(params) {
  const { data } = await api.get('/foods/', { params })
  return data
}

export async function createCustomFood(payload) {
  const { data } = await api.post('/foods/', payload)
  return data
}

export async function patchFood(id, payload) {
  const { data } = await api.patch(`/foods/${id}/`, payload)
  return data
}

export async function deleteFood(id) {
  await api.delete(`/foods/${id}/`)
}

export async function listMeals(params) {
  const { data } = await api.get('/meals/', { params })
  return data
}

export async function createMeal(payload) {
  const { data } = await api.post('/meals/', payload)
  return data
}

export async function deleteMeal(id) {
  await api.delete(`/meals/${id}/`)
}

export async function listActivities(params) {
  const { data } = await api.get('/activities/', { params })
  return data
}

export async function createActivity(payload) {
  const { data } = await api.post('/activities/', payload)
  return data
}

export async function deleteActivity(id) {
  await api.delete(`/activities/${id}/`)
}

export default api
