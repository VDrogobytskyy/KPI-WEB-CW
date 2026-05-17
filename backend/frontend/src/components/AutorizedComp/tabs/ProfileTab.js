import React, { useEffect, useState } from 'react'
import { Row, Col, Form, Button, Alert } from 'react-bootstrap'
import { useI18n } from '../../../i18n'

function ProfileTab({ me, onSave, saving, saveError, locale }) {
  const { t } = useI18n()
  const [form, setForm] = useState({
    email: '',
    first_name: '',
    last_name: '',
    profile: {
      weight_kg: '',
      height_cm: '',
      birth_date: '',
      sex: '',
      kcal_goal_daily: '',
      protein_goal: '',
      fat_goal: '',
      carbs_goal: '',
    },
  })
  const [savedMessage, setSavedMessage] = useState('')

  useEffect(() => {
    if (!me) return
    setForm({
      email: me.email || '',
      first_name: me.first_name || '',
      last_name: me.last_name || '',
      profile: {
        weight_kg: me.profile?.weight_kg ?? '',
        height_cm: me.profile?.height_cm ?? '',
        birth_date: me.profile?.birth_date ?? '',
        sex: me.profile?.sex ?? '',
        kcal_goal_daily: me.profile?.kcal_goal_daily ?? '',
        protein_goal: me.profile?.protein_goal ?? '',
        fat_goal: me.profile?.fat_goal ?? '',
        carbs_goal: me.profile?.carbs_goal ?? '',
      },
    })
    setSavedMessage('')
  }, [me])

  const weight = Number(form.profile.weight_kg)
  const heightM = Number(form.profile.height_cm) / 100
  const bmi = Number.isFinite(weight) && weight > 0 && Number.isFinite(heightM) && heightM > 0
    ? weight / (heightM * heightM)
    : null
  const macroGoal = [form.profile.protein_goal, form.profile.fat_goal, form.profile.carbs_goal]
    .map((value) => (value === '' ? 0 : Number(value)))
    .map((value) => (Number.isFinite(value) ? Math.round(value) : 0))

  const updateRoot = (field, value) => {
    setSavedMessage('')
    setForm((p) => ({ ...p, [field]: value }))
  }

  const updateProfile = (field, value) => {
    setSavedMessage('')
    setForm((p) => ({ ...p, profile: { ...p.profile, [field]: value } }))
  }

  const toNumberOrNull = (value) => (value === '' ? null : Number(value))

  async function handleSave() {
    if (!onSave) return
    await onSave({
      email: form.email.trim(),
      first_name: form.first_name.trim(),
      last_name: form.last_name.trim(),
      profile: {
        weight_kg: toNumberOrNull(form.profile.weight_kg),
        height_cm: toNumberOrNull(form.profile.height_cm),
        birth_date: form.profile.birth_date || null,
        sex: form.profile.sex || null,
        kcal_goal_daily: toNumberOrNull(form.profile.kcal_goal_daily),
        protein_goal: toNumberOrNull(form.profile.protein_goal),
        fat_goal: toNumberOrNull(form.profile.fat_goal),
        carbs_goal: toNumberOrNull(form.profile.carbs_goal),
      },
    })
    setSavedMessage(t('profileSaved'))
  }

  return (
    <Row className="g-4">
      <Col lg={8}>
        <div className="chart-card">
          <h3 className="chart-title chart-title--dark" style={{ marginBottom: 12 }}>
            {t('profileSettings')}
          </h3>

          {saveError && <Alert variant="danger">{saveError}</Alert>}
          {savedMessage && <Alert variant="success">{savedMessage}</Alert>}

          <Row className="g-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label style={{ color: 'rgba(255,255,255,0.85)' }}>{t('username')}</Form.Label>
                <Form.Control value={me?.username || ''} disabled />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label style={{ color: 'rgba(255,255,255,0.85)' }}>{t('email')}</Form.Label>
                <Form.Control
                  value={form.email}
                  onChange={(e) => updateRoot('email', e.target.value)}
                  placeholder="email@example.com"
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label style={{ color: 'rgba(255,255,255,0.85)' }}>{t('firstName')}</Form.Label>
                <Form.Control
                  value={form.first_name}
                  onChange={(e) => updateRoot('first_name', e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label style={{ color: 'rgba(255,255,255,0.85)' }}>{t('lastName')}</Form.Label>
                <Form.Control
                  value={form.last_name}
                  onChange={(e) => updateRoot('last_name', e.target.value)}
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label style={{ color: 'rgba(255,255,255,0.85)' }}>{t('weightKg')}</Form.Label>
                <Form.Control
                  type="number"
                  inputMode="decimal"
                  value={form.profile.weight_kg}
                  onChange={(e) => updateProfile('weight_kg', e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label style={{ color: 'rgba(255,255,255,0.85)' }}>{t('heightCm')}</Form.Label>
                <Form.Control
                  type="number"
                  inputMode="numeric"
                  value={form.profile.height_cm}
                  onChange={(e) => updateProfile('height_cm', e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label style={{ color: 'rgba(255,255,255,0.85)' }}>{t('dailyKcalGoal')}</Form.Label>
                <Form.Control
                  type="number"
                  inputMode="numeric"
                  value={form.profile.kcal_goal_daily}
                  onChange={(e) => updateProfile('kcal_goal_daily', e.target.value)}
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label style={{ color: 'rgba(255,255,255,0.85)' }}>{t('birthDate')}</Form.Label>
                <Form.Control
                  type="date"
                  value={form.profile.birth_date}
                  onChange={(e) => updateProfile('birth_date', e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label style={{ color: 'rgba(255,255,255,0.85)' }}>{t('sex')}</Form.Label>
                <Form.Select value={form.profile.sex} onChange={(e) => updateProfile('sex', e.target.value)}>
                  <option value="">{t('notSet')}</option>
                  <option value="male">{t('male')}</option>
                  <option value="female">{t('female')}</option>
                  <option value="other">{t('other')}</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label style={{ color: 'rgba(255,255,255,0.85)' }}>{t('proteinGoalG')}</Form.Label>
                <Form.Control
                  type="number"
                  inputMode="decimal"
                  value={form.profile.protein_goal}
                  onChange={(e) => updateProfile('protein_goal', e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label style={{ color: 'rgba(255,255,255,0.85)' }}>{t('fatGoalG')}</Form.Label>
                <Form.Control
                  type="number"
                  inputMode="decimal"
                  value={form.profile.fat_goal}
                  onChange={(e) => updateProfile('fat_goal', e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label style={{ color: 'rgba(255,255,255,0.85)' }}>{t('carbsGoalG')}</Form.Label>
                <Form.Control
                  type="number"
                  inputMode="decimal"
                  value={form.profile.carbs_goal}
                  onChange={(e) => updateProfile('carbs_goal', e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>

          <div style={{ marginTop: 14 }}>
            <Button
              variant="info"
              onClick={handleSave}
              disabled={!onSave || saving}
            >
              {saving ? t('saving') : t('saveProfile')}
            </Button>
          </div>
        </div>
      </Col>

      <Col lg={4}>
        <div className="chart-card">
          <h3 className="chart-title chart-title--dark" style={{ marginBottom: 12 }}>
            {t('healthSummary')}
          </h3>

          <div className="feature-card" style={{ marginBottom: 12 }}>
            <div className="feature-title">{t('bmi')}</div>
            <div className="feature-text">{bmi ? bmi.toFixed(1) : t('notSet')}</div>
          </div>

          <div className="feature-card" style={{ marginBottom: 12 }}>
            <div className="feature-title">{t('goalCalories')}</div>
            <div className="feature-text">
              {form.profile.kcal_goal_daily ? `${Math.round(Number(form.profile.kcal_goal_daily))} ${t('kcal')}` : t('notSet')}
            </div>
          </div>

          <div className="feature-card" style={{ marginBottom: 12 }}>
            <div className="feature-title">{t('macroGoals')}</div>
            <div className="feature-text">P {macroGoal[0]} / F {macroGoal[1]} / C {macroGoal[2]}</div>
          </div>

          <div className="feature-card">
            <div className="feature-title">{t('account')}</div>
            <div className="feature-text">
              {t('joined')}: {me?.date_joined ? new Date(me.date_joined).toLocaleDateString(locale) : t('notSet')}
            </div>
          </div>
        </div>
      </Col>
    </Row>
  )
}

export default ProfileTab
