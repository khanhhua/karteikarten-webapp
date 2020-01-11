import React from 'react';
import { replace } from 'react-router-redux';
import { Nav, Navbar, NavbarBrand, NavItem } from 'reactstrap';
import { connect } from 'react-redux';

const AppNavbar = ({ dispatch, className, children }) => (
  <Navbar className={className}>
    <Nav>
      <NavItem>
        <NavbarBrand onClick={() => dispatch(replace('/'))}>Karteikarten</NavbarBrand>
      </NavItem>
      {children}
    </Nav>
  </Navbar>
);

export default connect(null, dispatch => ({ dispatch }))(AppNavbar);
