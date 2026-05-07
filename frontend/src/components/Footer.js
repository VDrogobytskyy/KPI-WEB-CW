import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

function Footer() {
  return (
    <footer style={{ backgroundColor: '#073642', color: '#839496', marginTop: '50px' }}>
      <Container className="py-5">
        <Row>
          <Col md={4} className="mb-3 mb-md-0">
            <h5 style={{ color: '#eee8d5' }}>Web Calorie Tracker</h5>
            <p style={{ fontSize: '0.9rem' }}>
              Your personal assistant in achieving fitness goals. Track, analyze, and improve your lifestyle with our smart data insights.
            </p>
          </Col>

          <Col md={4} className="mb-md-0 text-md-center">
            <h5 style={{ color: '#eee8d5' }}>Quick Links</h5>
            <ul className="list-unstyled">
              <li><a href="/" style={{ color: '#2aa198', textDecoration: 'none' }}>Home</a></li>
              <li><a href="/login" style={{ color: '#2aa198', textDecoration: 'none' }}>Log In</a></li>
              <li><a href="/profile" style={{ color: '#2aa198', textDecoration: 'none' }}>Profile</a></li>
            </ul>
          </Col>

          <Col md={4} className="text-md-end">
            <h5 style={{ color: '#eee8d5' }}>Follow Us</h5>
            <div className="fs-4 mb-3">
              <a href="https://github.com" className="me-3" style={{ color: '#268bd2' }} aria-label="GitHub"><i className="fab fa-github"></i></a>
              <a href="https://instagram.com" className="me-3" style={{ color: '#268bd2' }} aria-label="Instagram"><i className="fab fa-instagram"></i></a>
              <a href="https://twitter.com" style={{ color: '#268bd2' }} aria-label="Twitter"><i className="fab fa-twitter"></i></a>
            </div>
            <p style={{ fontSize: '0.8rem' }}>support@calorietracker.com</p>
          </Col>
        </Row>

        <hr style={{ backgroundColor: '#586e75', margin: '30px 0' }} />

        <Row>
          <Col className="text-center" style={{ fontSize: '0.85rem', opacity: 0.7 }}>
            &copy; {new Date().getFullYear()} Web Calorie Tracker. Created for KPI Course Work.
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
