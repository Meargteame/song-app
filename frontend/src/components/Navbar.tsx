import React from "react";
import styled from "@emotion/styled";
import { theme, Button } from "../styles";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { toggleThemeMode } from "../store/slices/songSlice";

const Nav = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0 1.5rem 0;
  border-bottom: 1px solid ${theme.colors.cardBorder};
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
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

const ActionsGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const ThemeToggle = styled.button`
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.cardBorder};
  color: ${theme.colors.textSecondary};
  padding: 0.55rem 0.9rem;
  border-radius: 6px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.825rem;
  font-weight: 500;
  font-family: inherit;

  &:hover {
    color: ${theme.colors.textPrimary};
    background: ${theme.colors.surfaceHover};
    border-color: ${theme.colors.cardBorderHover};
  }
`;

interface NavbarProps {
  onOpenAddModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAddModal }) => {
  const dispatch = useAppDispatch();
  const themeMode = useAppSelector((state) => state.songs.themeMode);

  return (
    <Nav>
      <TitleGroup>
        <Title>Song Management</Title>
        <Subtitle>Catalog & Aggregated Metrics</Subtitle>
      </TitleGroup>

      <ActionsGroup>
        <ThemeToggle
          onClick={() => dispatch(toggleThemeMode())}
          title={`Switch to ${themeMode === "dark" ? "Light" : "Dark"} Mode`}
          aria-label="Toggle theme mode"
        >
          {themeMode === "dark" ? (
            <>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
              <span>Light</span>
            </>
          ) : (
            <>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
              <span>Dark</span>
            </>
          )}
        </ThemeToggle>

        <Button variant="primary" size="md" onClick={onOpenAddModal}>
          + Add Song
        </Button>
      </ActionsGroup>
    </Nav>
  );
};