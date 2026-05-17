import React from 'react'
import { Container, Navbar, Nav, Form } from 'react-bootstrap'

import { LinkContainer } from 'react-router-bootstrap'
import { Link } from 'react-router-dom'
import { useAuthToken } from '../auth/tokenStore'
import { useI18n } from '../i18n'

function Header() {
    const token = useAuthToken()
    const hasToken = Boolean(token)
    const { language, languages, setLanguage, t } = useI18n()
    return (
        <header className="header">
            <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
                <Container>
                    <LinkContainer to="/">
                      <Navbar.Brand>{t('appName')}</Navbar.Brand>
                    </LinkContainer>
                    
                    <div className="navbar-brand-centered" style={{
                        position: 'absolute',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 10
                    }}>
                        <Link to="/">
                            <img 
                                src="/favicon.ico" 
                                width="40" 
                                height="40" 
                                className="d-inline-block align-top" 
                                alt="Logo" 
                            />
                        </Link>
                    </div>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto align-items-lg-center">
                            <Form.Select
                              size="sm"
                              aria-label={t('language')}
                              value={language}
                              onChange={(e) => setLanguage(e.target.value)}
                              className="me-lg-3 my-2 my-lg-0 language-select"
                              style={{ width: '80px' }}
                            >
                              {languages.map((item) => (
                                <option key={item.code} value={item.code}>
                                  {item.shortLabel}
                                </option>
                              ))}
                            </Form.Select>
                            {/* <Nav.Link href="/Profile"><i className="fas fa-user-plus"></i>Sing up</Nav.Link> */}
                            {hasToken ? (
                              <LinkContainer to={{ pathname: "/app", search: "?tab=profile" }}>
                                <Nav.Link>
                                  <i className="fas fa-user"></i>{t('profile')}
                                </Nav.Link>
                              </LinkContainer>
                            ) : (
                              <LinkContainer to='/login'>
                                  <Nav.Link><i className="fas fa-user"></i>{t('login')}</Nav.Link>
                              </LinkContainer>
                            )}

                            {hasToken && (
                              <Nav.Link
                                onClick={() => {
                                  localStorage.removeItem('authToken')
                           
                                  window.dispatchEvent(new Event('authTokenChanged'))
                                  window.location.href = '/'
                                }}
                              >
                                <i className="fas fa-sign-out-alt"></i>{t('logout')}
                              </Nav.Link>
                            )}
                            
                            {/* <Nav.Link href="/Home"><i className="fas fa-home"></i>Home page</Nav.Link> */}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    )
}

export default Header
