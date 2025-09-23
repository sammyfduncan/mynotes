import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--primary-bg);
  border-bottom: 1px solid var(--secondary-bg);
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-text);
  text-decoration: none;
`;

const Nav = styled.nav`
  display: flex;
  gap: 2rem;
`;

const NavLink = styled(Link)`
  color: var(--secondary-text);
  text-decoration: none;
  transition: color 0.3s ease;

  &:hover {
    color: var(--primary-text);
  }
`;

const Header: React.FC = () => {
  return (
    <HeaderContainer>
      <Logo to="/">MyNotes</Logo>
      <Nav>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/about">About</NavLink>
        <NavLink to="/dashboard">Dashboard</NavLink>
        <NavLink to="/login">Login</NavLink>
      </Nav>
    </HeaderContainer>
  );
};

export default Header;