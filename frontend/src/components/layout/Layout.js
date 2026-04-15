import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const Container = styled.div`
  display: flex;
`;

const Sidebar = styled.div`
  width: 220px;
  height: 100vh;
  background: #111827;
  color: white;
  padding: 20px;
`;

const Main = styled.div`
  flex: 1;
  padding: 20px;
  background: #f3f4f6;
`;

const NavItem = styled(Link)`
  display: block;
  color: white;
  margin: 15px 0;
  text-decoration: none;
  font-weight: bold;

  &:hover {
    color: #38bdf8;
  }
`;

const Layout = ({ children }) => {
  return (
    <Container>
      <Sidebar>
        <h2>Inventory</h2>
        <NavItem to="/dashboard">Dashboard</NavItem>
        <NavItem to="/products">Products</NavItem>
      </Sidebar>

      <Main>{children}</Main>
    </Container>
  );
};

export default Layout;