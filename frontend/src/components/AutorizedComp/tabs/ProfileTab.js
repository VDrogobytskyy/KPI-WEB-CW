import React, { useEffect, useState } from 'react'
import { Row, Col, Form, Button, Alert } from 'react-bootstrap'

function ProfileTab({ me, onSave, saving, saveError }) {
  const [form, setForm] = useState({
    email: '',
    profile: {
      weight_kg: '',
      height_cm: '',
      kcal_goal_daily: '',
      protein_goal: '',
      fat_goal: '',
      carbs_goal: '',
    },
  })

  useEffect(() => {
    if (!me) return
    setForm({
      email: me.email || '',
      profile: {
        weight_kg: me.profile?.weight_kg ?? '',
        height_cm: me.profile?.height_cm ?? '',
        kcal_goal_daily: me.profile?.kcal_goal_daily ?? '',
        protein_goal: me.profile?.protein_goal ?? '',
        fat_goal: me.profile?.fat_goal ?? '',
        carbs_goal: me.profile?.carbs_goal ?? '',
      },
    })
  }, [me])

  return (
    <Row className="g-4">
      <Col lg={8}>
        <div className="chart-card">
          <h3 className="chart-title chart-title--dark" style={{ marginBottom: 12 }}>
            Profile settings
          </h3>

          {saveError && <Alert variant="danger">{saveError}</Alert>}

          <Row className="g-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label style={{ color: 'rgba(255,255,255,0.85)' }}>Username</Form.Label>
                <Form.Control value={me?.username || ''} disabled />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label style={{ color: 'rgba(255,255,255,0.85)' }}>Email</Form.Label>
                <Form.Control
                  value={form.email}
                  onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                  placeholder="email@example.com"
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label style={{ color: 'rgba(255,255,255,0.85)' }}>Weight (kg)</Form.Label>
                <Form.Control
                  type="number"
                  inputMode="decimal"
                  value={form.profile.weight_kg}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, profile: { ...p.profile, weight_kg: e.target.value } }))
                  }
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label style={{ color: 'rgba(255,255,255,0.85)' }}>Height (cm)</Form.Label>
                <Form.Control
                  type="number"
                  inputMode="numeric"
                  value={form.profile.height_cm}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, profile: { ...p.profile, height_cm: e.target.value } }))
                  }
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label style={{ color: 'rgba(255,255,255,0.85)' }}>Daily kcal goal</Form.Label>
                <Form.Control
                  type="number"
                  inputMode="numeric"
                  value={form.profile.kcal_goal_daily}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, profile: { ...p.profile, kcal_goal_daily: e.target.value } }))
                  }
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label style={{ color: 'rgba(255,255,255,0.85)' }}>Protein goal (g)</Form.Label>
                <Form.Control
                  type="number"
                  inputMode="decimal"
                  value={form.profile.protein_goal}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, profile: { ...p.profile, protein_goal: e.target.value } }))
                  }
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label style={{ color: 'rgba(255,255,255,0.85)' }}>Fat goal (g)</Form.Label>
                <Form.Control
                  type="number"
                  inputMode="decimal"
                  value={form.profile.fat_goal}
                  onChange={(e) => setForm((p) => ({ ...p, profile: { ...p.profile, fat_goal: e.target.value } }))}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label style={{ color: 'rgba(255,255,255,0.85)' }}>Carbs goal (g)</Form.Label>
                <Form.Control
                  type="number"
                  inputMode="decimal"
                  value={form.profile.carbs_goal}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, profile: { ...p.profile, carbs_goal: e.target.value } }))
                  }
                />
              </Form.Group>
            </Col>
          </Row>

          <div style={{ marginTop: 14 }}>
            <Button
              variant="info"
              onClick={() =>
                onSave &&
                onSave({
                  email: form.email,
                  profile: {
                    weight_kg: form.profile.weight_kg === '' ? null : Number(form.profile.weight_kg),
                    height_cm: form.profile.height_cm === '' ? null : Number(form.profile.height_cm),
                    kcal_goal_daily: form.profile.kcal_goal_daily === '' ? null : Number(form.profile.kcal_goal_daily),
                    protein_goal: form.profile.protein_goal === '' ? null : Number(form.profile.protein_goal),
                    fat_goal: form.profile.fat_goal === '' ? null : Number(form.profile.fat_goal),
                    carbs_goal: form.profile.carbs_goal === '' ? null : Number(form.profile.carbs_goal),
                  },
                })
              }
              disabled={!onSave || saving}
            >
              {saving ? 'Saving…' : 'Save'}
            </Button>
          </div>
        </div>
      </Col>
    </Row>
  )
}

export default ProfileTab
