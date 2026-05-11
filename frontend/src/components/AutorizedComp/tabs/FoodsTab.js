import React from 'react'
import { Alert, Table, InputGroup, Form, Button, Spinner } from 'react-bootstrap'

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
  return (
    <>
      <div className="chart-card">
        <h3 className="chart-title chart-title--dark" style={{ marginBottom: 12 }}>
          Food search (USDA)
        </h3>

        <InputGroup className="mb-3">
          <Form.Control
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search product name, e.g. banana"
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
                Searching
              </>
            ) : (
              'Search'
            )}
          </Button>
        </InputGroup>

        {error && <Alert variant="danger">{error}</Alert>}

        <Table responsive bordered hover size="sm" style={{ color: 'rgba(255,255,255,0.88)' }}>
          <thead>
            <tr>
              <th>Description</th>
              <th>Brand</th>
              <th>Type</th>
              <th style={{ width: 110 }}>FDC ID</th>
              <th style={{ width: 220 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {results.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ opacity: 0.8 }}>
                  {loading ? 'Loading…' : 'No results yet.'}
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
                        {addingId === String(f.fdcId) ? 'Adding…' : 'Add to meal'}
                      </Button>

                      {f.cached ? (
                        <span style={{ opacity: 0.9, alignSelf: 'center' }}>Cached</span>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline-info"
                          onClick={() => onImport && onImport(f)}
                          disabled={!onImport || importingId === String(f.fdcId)}
                        >
                          {importingId === String(f.fdcId) ? 'Importing…' : 'Import'}
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
