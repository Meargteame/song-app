import React from "react";
import styled from "@emotion/styled";
import { theme, Button } from "../styles";

const Nav = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 0;
  border-bottom: 1px solid ${theme.colors.cardBorder};
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${theme.colors.accent};
  margin: 0;
`;

interface NavbarProps {
  onOpenAddModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAddModal }) => {
  return (
    <Nav>
      <Title>🎵 Song Manager</Title>
      <Button variant="primary" onClick={onOpenAddModal}>
        + Add Song
      </Button>
    </Nav>
  );
};