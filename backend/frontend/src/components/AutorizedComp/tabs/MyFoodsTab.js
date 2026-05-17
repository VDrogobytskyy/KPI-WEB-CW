import React, { useState } from 'react'
import { Alert, Table, InputGroup, Form, Button, Modal, Row, Col } from 'react-bootstrap'
import { useI18n } from '../../../i18n'

function EditFoodModal({ show, onHide, food, onSave, onDelete, saving, error }) {
  const { t } = useI18n()
  const [form, setForm] = useState(null)

  React.useEffect(() => {
    if (!food) return
    setForm({
      name: food.name || '',
      brand: food.brand || '',
      kcal_per_100g: food.kcal_per_100g ?? '',
      protein_per_100g: food.protein_per_100g ?? '',
      fat_per_100g: food.fat_per_100g ?? '',
      carbs_per_100g: food.carbs_per_100g ?? '',
    })
  }, [food])

  if (!form) return null

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('editFood')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Row className="g-3">
          <Col sm={12}>
            <Form.Control
              placeholder={t('name')}
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            />
          </Col>
          <Col sm={12}>
            <Form.Control
              placeholder={t('brand')}
              value={form.brand}
              onChange={(e) => setForm((p) => ({ ...p, brand: e.target.value }))}
            />
          </Col>
          <Col sm={6}>
            <Form.Control
              type="number"
              inputMode="decimal"
              placeholder={t('kcalPer100g')}
              value={form.kcal_per_100g}
              onChange={(e) => setForm((p) => ({ ...p, kcal_per_100g: e.target.value }))}
            />
          </Col>
          <Col sm={6}>
            <Form.Control
              type="number"
              inputMode="decimal"
              placeholder={t('proteinPer100g')}
              value={form.protein_per_100g}
              onChange={(e) => setForm((p) => ({ ...p, protein_per_100g: e.target.value }))}
            />
          </Col>
          <Col sm={6}>
            <Form.Control
              type="number"
              inputMode="decimal"
              placeholder={t('fatPer100g')}
              value={form.fat_per_100g}
              onChange={(e) => setForm((p) => ({ ...p, fat_per_100g: e.target.value }))}
            />
          </Col>
          <Col sm={6}>
            <Form.Control
              type="number"
              inputMode="decimal"
              placeholder={t('carbsPer100g')}
              value={form.carbs_per_100g}
              onChange={(e) => setForm((p) => ({ ...p, carbs_per_100g: e.target.value }))}
            />
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer style={{ justifyContent: 'space-between' }}>
        <Button variant="outline-light" onClick={() => onDelete && onDelete(food)} disabled={!onDelete || saving}>
          {t('delete')}
        </Button>
        <div style={{ display: 'flex', gap: 10 }}>
          <Button variant="secondary" onClick={onHide}>
            {t('cancel')}
          </Button>
          <Button
            variant="info"
            onClick={() =>
              onSave &&
              onSave(food, {
                name: form.name.trim(),
                brand: form.brand.trim() || null,
                kcal_per_100g: form.kcal_per_100g === '' ? null : Number(form.kcal_per_100g),
                protein_per_100g: form.protein_per_100g === '' ? null : Number(form.protein_per_100g),
                fat_per_100g: form.fat_per_100g === '' ? null : Number(form.fat_per_100g),
                carbs_per_100g: form.carbs_per_100g === '' ? null : Number(form.carbs_per_100g),
              })
            }
            disabled={!onSave || saving || !form.name.trim()}
          >
            {saving ? t('saving') : t('save')}
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  )
}

function MyFoodsTab({ query, setQuery, onSearch, loading, error, foods, onEdit }) {
  const { t } = useI18n()

  return (
    <div className="chart-card">
      <h3 className="chart-title chart-title--dark" style={{ marginBottom: 12 }}>
        {t('myFoodsCustom')}
      </h3>

      <InputGroup className="mb-3">
        <Form.Control
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('searchYourFoods')}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              onSearch && onSearch()
            }
          }}
        />
        <Button variant="info" onClick={() => onSearch && onSearch()} disabled={!onSearch || loading}>
          {loading ? t('loading') : t('search')}
        </Button>
      </InputGroup>

      {error && <Alert variant="danger">{error}</Alert>}

      <Table responsive bordered hover size="sm" style={{ color: 'rgba(255,255,255,0.88)' }}>
        <thead>
          <tr>
            <th>{t('name')}</th>
            <th>{t('brand')}</th>
            <th style={{ width: 110 }}>kcal/100g</th>
            <th style={{ width: 90 }} />
          </tr>
        </thead>
        <tbody>
          {foods.length === 0 ? (
            <tr>
              <td colSpan={4} style={{ opacity: 0.8 }}>
                {t('noCustomFoodsYet')}
              </td>
            </tr>
          ) : (
            foods.map((f) => (
              <tr key={String(f.id)}>
                <td>{f.name}</td>
                <td>{f.brand || '-'}</td>
                <td>{f.kcal_per_100g ?? '-'}</td>
                <td>
                  <Button size="sm" variant="outline-info" onClick={() => onEdit && onEdit(f)} disabled={!onEdit}>
                    {t('edit')}
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </div>
  )
}

export { EditFoodModal }
export default MyFoodsTab
