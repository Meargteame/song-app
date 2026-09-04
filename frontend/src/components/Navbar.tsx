import React from "react";
import styled from "@emotion/styled";
import { theme, Button } from "../styles";

const Nav = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0 1.5rem 0;
  border-bottom: 1px solid ${theme.colors.cardBorder};
  margin-bottom: 2rem;
`;

const TitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${theme.colors.textPrimary};
  margin: 0;
  letter-spacing: -0.02em;
`;

const Subtitle = styled.span`
  font-size: 0.85rem;
  color: ${theme.colors.textMuted};
  font-weight: 400;
`;

interface NavbarProps {
  onOpenAddModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAddModal }) => {
  return (
    <Nav>
      <TitleGroup>
        <Title>Song Management</Title>
        <Subtitle>Catalog & Aggregated Metrics</Subtitle>
      </TitleGroup>
      <Button variant="primary" size="md" onClick={onOpenAddModal}>
        + Add Song
      </Button>
    </Nav>
  );
};