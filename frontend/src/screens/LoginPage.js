import React, { useState } from 'react'
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

import Reveal from '../components/Reveal'
import { login as apiLogin, register as apiRegister } from '../api/client'

function LoginPage() {
  const navigate = useNavigate()
  const [mode, setMode] = useState('login') // login | register
  const [loginForm, setLoginForm] = useState({ username: '', password: '' })
  const [registerForm, setRegisterForm] = useState({ username: '', email: '', password: '' })
  const [loggingIn, setLoggingIn] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin() {
    const username = loginForm.username.trim()
    const password = loginForm.password
    if (!username || !password) return
    setLoggingIn(true)
    setError('')
    try {
      await apiLogin(username, password)
      navigate('/app')
    } catch (e) {
      setError(e?.response?.data?.detail || e?.message || 'Login failed')
    } finally {
      setLoggingIn(false)
    }
  }

  async function handleRegister() {
    const username = registerForm.username.trim()
    const email = registerForm.email.trim()
    const password = registerForm.password
    if (!username || !password) return
    setLoggingIn(true)
    setError('')
    try {
      await apiRegister({ username, email, password })
      navigate('/app')
    } catch (e) {
      const detail = e?.response?.data?.detail || e?.message || 'Registration failed'
      const errors = Array.isArray(e?.response?.data?.errors) ? e.response.data.errors.join(' ') : ''
      setError(errors ? `${detail} ${errors}` : detail)
    } finally {
      setLoggingIn(false)
    }
  }

  return (
    <main className="app-shell">
      <Container>
        <section className="section section-dark" style={{ padding: 24 }}>
          <Reveal>
            <h2 className="section-title">{mode === 'login' ? 'Log in' : 'Register'}</h2>

            {error && <Alert variant="danger">{error}</Alert>}

            <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
              <Button
                variant={mode === 'login' ? 'info' : 'outline-light'}
                size="sm"
                onClick={() => {
                  setError('')
                  setMode('login')
                }}
              >
                Log in
              </Button>
              <Button
                variant={mode === 'register' ? 'info' : 'outline-light'}
                size="sm"
                onClick={() => {
                  setError('')
                  setMode('register')
                }}
              >
                Register
              </Button>
            </div>

            <Row className="g-3" style={{ maxWidth: 520 }}>
              {mode === 'login' ? (
                <>
                  <Col sm={12}>
                    <Form.Control
                      placeholder="Username"
                      value={loginForm.username}
                      onChange={(e) => setLoginForm((p) => ({ ...p, username: e.target.value }))}
                    />
                  </Col>
                  <Col sm={12}>
                    <Form.Control
                      type="password"
                      placeholder="Password"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm((p) => ({ ...p, password: e.target.value }))}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          handleLogin()
                        }
                      }}
                    />
                  </Col>
                  <Col sm={12}>
                    <Button variant="info" onClick={handleLogin} disabled={loggingIn}>
                      {loggingIn ? 'Logging in…' : 'Log in'}
                    </Button>
                  </Col>
                </>
              ) : (
                <>
                  <Col sm={12}>
                    <Form.Control
                      placeholder="Username"
                      value={registerForm.username}
                      onChange={(e) => setRegisterForm((p) => ({ ...p, username: e.target.value }))}
                    />
                  </Col>
                  <Col sm={12}>
                    <Form.Control
                      placeholder="Email (optional)"
                      value={registerForm.email}
                      onChange={(e) => setRegisterForm((p) => ({ ...p, email: e.target.value }))}
                    />
                  </Col>
                  <Col sm={12}>
                    <Form.Control
                      type="password"
                      placeholder="Password"
                      value={registerForm.password}
                      onChange={(e) => setRegisterForm((p) => ({ ...p, password: e.target.value }))}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          handleRegister()
                        }
                      }}
                    />
                  </Col>
                  <Col sm={12}>
                    <Button variant="info" onClick={handleRegister} disabled={loggingIn}>
                      {loggingIn ? 'Creating…' : 'Create account'}
                    </Button>
                  </Col>
                </>
              )}
            </Row>
          </Reveal>
        </section>
      </Container>
    </main>
  )
}

export default LoginPage
