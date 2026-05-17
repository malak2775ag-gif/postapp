import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/hibr_logo.png';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../Features/UserSlice';
import {
  Button,
  Navbar,
  Nav,
  NavItem,
  NavbarBrand,
  Container
} from 'reactstrap';

const Header = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.users);

  return (
    <header>
      <Navbar className="fancy-header">
        <Container>
          <NavbarBrand tag={Link} to="/" className="d-flex align-items-center">
            <img src={logo} alt="HIBR Logo" style={{ height: '60px', marginRight: '12px', borderRadius: '50%'}} /> {/* Corrected to .png */}
            HIBR
          </NavbarBrand>
          <Nav className="ms-auto flex-row" navbar>
            <NavItem>
              <Link className="nav-link cute-nav-link" to="/">Home</Link>
            </NavItem>
            {!user ? (
              <>
                <NavItem>
                  <Link className="nav-link cute-nav-link" to="/login">Login</Link>
                </NavItem>
                <NavItem>
                  <Link className="nav-link cute-nav-link" to="/register">Register</Link>
                </NavItem>
              </>
            ) : (
              <NavItem>
                <Link to="/profile" className="nav-link cute-nav-link text-primary me-2" style={{ textDecoration: 'none' }}>
                  Hello, {user.username}
                </Link>
                <Button color="link" className="nav-link cute-nav-link" onClick={() => dispatch(logout())}>
                  Logout
                </Button>
              </NavItem>
            )}
          </Nav>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;