import React from 'react'
import { Container, Navbar, Nav } from 'react-bootstrap'

import { LinkContainer } from 'react-router-bootstrap'
import { Link } from 'react-router-dom'
import { useAuthToken } from '../auth/tokenStore'

function Header() {
    const token = useAuthToken()
    const hasToken = Boolean(token)
    return (
        <header className="header">
            <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
                <Container>
                    <Navbar.Brand href="/">Web Calorie Tracker</Navbar.Brand>
                    
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
                        <Nav className="ms-auto">
                            {/* <Nav.Link href="/Profile"><i className="fas fa-user-plus"></i>Sing up</Nav.Link> */}
                            {hasToken ? (
                              <Nav.Link href="/app?tab=profile">
                                <i className="fas fa-user"></i>Profile
                              </Nav.Link>
                            ) : (
                              <LinkContainer to='/login'>
                                  <Nav.Link><i className="fas fa-user"></i>Log in</Nav.Link>
                              </LinkContainer>
                            )}

                            {hasToken && (
                              <Nav.Link
                                onClick={() => {
                                  localStorage.removeItem('authToken')
                                  // keep UI in sync without relying on a full reload
                                  window.dispatchEvent(new Event('authTokenChanged'))
                                  window.location.href = '/'
                                }}
                              >
                                <i className="fas fa-sign-out-alt"></i>Log out
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
