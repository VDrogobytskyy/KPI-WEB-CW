import { useSyncExternalStore } from 'react'

const EVENT_NAME = 'authTokenChanged'

function getToken() {
  return localStorage.getItem('authToken')
}

function subscribe(callback) {
  const handler = () => callback()
  window.addEventListener('storage', handler)
  window.addEventListener(EVENT_NAME, handler)
  return () => {
    window.removeEventListener('storage', handler)
    window.removeEventListener(EVENT_NAME, handler)
  }
}

export function emitAuthTokenChanged() {
  window.dispatchEvent(new Event(EVENT_NAME))
}

export function useAuthToken() {
  return useSyncExternalStore(subscribe, getToken, () => null)
}

