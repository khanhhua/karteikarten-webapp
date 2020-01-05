import { Nav, Navbar, NavbarBrand, NavItem } from 'reactstrap';
import React from 'react';

export default ({ children }) => (
  <Navbar>
    <Nav>
      <NavItem>
        <NavbarBrand>Karteikarten</NavbarBrand>
      </NavItem>
      {children}
    </Nav>
  </Navbar>
);
