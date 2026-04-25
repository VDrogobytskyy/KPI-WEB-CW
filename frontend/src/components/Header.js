import React from 'react'
import { Container, Navbar, Nav, Rowm } from 'react-bootstrap'

function Header() {
    return (
        <header>
            <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
                <Container>
                    <Navbar.Brand href="/">Web Calorie Tracker</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto">
                            <Nav.Link href="/Profile"><i className="fas fa-user-plus"></i>Sing up</Nav.Link>
                            <Nav.Link href="/login"><i className="fas fa-user"></i>Log in</Nav.Link>
                            <Nav.Link href="/Home"><i className="fas fa-home"></i>Home page</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    )
}

export default Header
