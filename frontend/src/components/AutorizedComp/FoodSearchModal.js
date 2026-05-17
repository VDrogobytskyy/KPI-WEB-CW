// src/components/AutorizedComp/FoodSearchModal.js
import React from 'react'
import { Modal, Alert, InputGroup, Form, Button, Spinner, Table } from 'react-bootstrap'
import { useI18n } from '../../i18n'

function FoodSearchModal({
  show,
  onHide,
  query,
  setQuery,
  onSearch,
  loading,
  error,
  results,
  onPickFood,
  pickingId,
}) {
  const { t } = useI18n()

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{t('searchFoodUsda')}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <InputGroup className="mb-3">
          <Form.Control
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('searchProductPlaceholder')}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                onSearch()
              }
            }}
          />
          <Button variant="info" onClick={onSearch} disabled={loading || !query.trim()}>
            {loading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                {t('searching')}
              </>
            ) : (
              t('search')
            )}
          </Button>
        </InputGroup>

        {error && <Alert variant="danger">{error}</Alert>}

        <Table bordered hover responsive size="sm">
          <thead>
            <tr>
              <th>{t('description')}</th>
              <th>{t('brand')}</th>
              <th>{t('type')}</th>
              <th style={{ width: 110 }}>FDC ID</th>
              <th style={{ width: 120 }} />
            </tr>
          </thead>
          <tbody>
            {results.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ opacity: 0.8 }}>
                  {loading ? t('loading') : t('noResultsYet')}
                </td>
              </tr>
            ) : (
              results.map((f) => (
                <tr key={String(f.fdcId)}>
                  <td>{f.description || '-'}</td>
                  <td>{f.brandOwner || '-'}</td>
                  <td>{f.dataType || '-'}</td>
                  <td>{f.fdcId}</td>
                  <td>
                    <Button
                      size="sm"
                      variant="info"
                      onClick={() => onPickFood && onPickFood(f)}
                      disabled={!onPickFood || pickingId === String(f.fdcId)}
                    >
                      {pickingId === String(f.fdcId) ? t('adding') : t('add')}
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>{t('close')}</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default FoodSearchModal
