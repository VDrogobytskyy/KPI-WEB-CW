import React from 'react'
import { Alert, Table, InputGroup, Form, Button, Spinner } from 'react-bootstrap'

function FoodsTab({
  query,
  setQuery,
  onSearch,
  loading,
  error,
  results,
}) {
  return (
    <>
      <div className="callout mb-3">
        <div className="callout-title">Endpoints scaffold</div>
        <div className="callout-text">
          Planned:
          <div style={{ marginTop: 8 }}>
            <div><code>GET /api/foods/?search=banana</code></div>
            <div><code>GET /api/foods/:id</code></div>
            <div><code>POST /api/foods/</code></div>
            <div><code>PATCH /api/foods/:id</code></div>
            <div><code>DELETE /api/foods/:id</code></div>
          </div>
        </div>
      </div>

      <div className="chart-card">
        <h3 className="chart-title chart-title--dark" style={{ marginBottom: 12 }}>
          Food search (UI + API)
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
            </tr>
          </thead>
          <tbody>
            {results.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ opacity: 0.8 }}>
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
