import { Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export function SiteNavbar() {
    return <Navbar bg="light" expand="lg">
        <a className='navbar-brand' href="https://www.logic-square.com" rel="noreferrer" target={'_blank'}><img src="https://res.cloudinary.com/www-logic-square-com/image/upload/v1551945805/ls-logo.png"
            className="ls-logo" alt="LS Logo" /></a>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto">
                <Link className='nav-link' to="/">Dashboard</Link>
            </Nav>
        </Navbar.Collapse>
    </Navbar>
}