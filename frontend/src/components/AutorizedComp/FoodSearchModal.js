// src/components/AutorizedComp/FoodSearchModal.js
import React from 'react'
import { Modal, Alert, InputGroup, Form, Button, Spinner, Table } from 'react-bootstrap'

function FoodSearchModal({
  show,
  onHide,
  query,
  setQuery,
  onSearch,
  loading,
  error,
  results,
}) {
  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Search food (USDA)</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Alert variant="secondary" className="mb-3">
          This calls backend endpoint <code>/api/foods/search/?q=...</code>.
        </Alert>

        <InputGroup className="mb-3">
          <Form.Control
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. banana"
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

        <Table bordered hover responsive size="sm">
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
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default FoodSearchModal
