import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom'
import { useI18n } from '../i18n'

function Footer() {
  const { t } = useI18n()

  return (
    <footer style={{ backgroundColor: '#073642', color: '#839496', marginTop: '50px' }}>
      <Container className="py-5">
        <Row>
          <Col md={4} className="mb-3 mb-md-0">
            <h5 style={{ color: '#eee8d5' }}>{t('appName')}</h5>
            <p style={{ fontSize: '0.9rem' }}>
              {t('footerDescription')}
            </p>
          </Col>

          <Col md={4} className="mb-md-0 text-md-center">
            <h5 style={{ color: '#eee8d5' }}>{t('quickLinks')}</h5>
            <ul className="list-unstyled">
              <li><Link to="/" style={{ color: '#2aa198', textDecoration: 'none' }}>{t('home')}</Link></li>
              <li><Link to="/login" style={{ color: '#2aa198', textDecoration: 'none' }}>{t('login')}</Link></li>
              <li><Link to={{ pathname: "/app", search: "?tab=profile" }} style={{ color: '#2aa198', textDecoration: 'none' }}>{t('profile')}</Link></li>
            </ul>
          </Col>

          <Col md={4} className="text-md-end">
            <p style={{ fontSize: '0.8rem' }}>support@calorietracker.com</p>
          </Col>
        </Row>

        <hr style={{ backgroundColor: '#586e75', margin: '30px 0' }} />

        <Row>
          <Col className="text-center" style={{ fontSize: '0.85rem', opacity: 0.7 }}>
            &copy; {new Date().getFullYear()} {t('appName')}.
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
