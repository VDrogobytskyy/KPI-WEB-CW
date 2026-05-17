import React from 'react'
import { Alert, Table, InputGroup, Form, Button, Spinner } from 'react-bootstrap'
import { useI18n } from '../../../i18n'

function FoodsTab({
  query,
  setQuery,
  onSearch,
  loading,
  error,
  results,
  onImport,
  importingId,
  onAddToMeal,
  addingId,
}) {
  const { t } = useI18n()

  return (
    <>
      <div className="chart-card">
        <h3 className="chart-title chart-title--dark" style={{ marginBottom: 12 }}>
          {t('searchFoodUsda')}
        </h3>

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

        <Table responsive bordered hover size="sm" style={{ color: 'rgba(255,255,255,0.88)' }}>
          <thead>
            <tr>
              <th>{t('description')}</th>
              <th>{t('brand')}</th>
              <th>{t('type')}</th>
              <th style={{ width: 110 }}>FDC ID</th>
              <th style={{ width: 220 }}>{t('actions')}</th>
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
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                      <Button
                        size="sm"
                        variant="info"
                        onClick={() => onAddToMeal && onAddToMeal(f)}
                        disabled={!onAddToMeal || addingId === String(f.fdcId)}
                      >
                        {addingId === String(f.fdcId) ? t('adding') : t('addToMeal')}
                      </Button>

                      {f.cached ? (
                        <span style={{ opacity: 0.9, alignSelf: 'center' }}>{t('cached')}</span>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline-info"
                          onClick={() => onImport && onImport(f)}
                          disabled={!onImport || importingId === String(f.fdcId)}
                        >
                          {importingId === String(f.fdcId) ? t('importing') : t('import')}
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>
    </>
  )
}

export default FoodsTab
