import React from "react";
import styled from "@emotion/styled";
import { theme, Button } from "../styles";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { toggleThemeMode, setCurrentPage } from "../store/slices/songSlice";

const StickyNav = styled.nav`
  position: sticky;
  top: 0;
  z-index: 900;
  background: ${theme.colors.background};
  border-bottom: 1px solid ${theme.colors.cardBorder};
  margin: -2.5rem -1.5rem 2rem -1.5rem;
  backdrop-filter: blur(12px);

  @media (max-width: 640px) {
    margin: -2.5rem -1rem 1.5rem -1rem;
  }
`;

const NavTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0.75rem 1.5rem;
  flex-wrap: wrap;
  gap: 0.75rem;

  @media (max-width: 640px) {
    padding: 0.75rem 1rem;
  }
`;

const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  cursor: default;
`;

const LogoMark = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 7px;
  background: ${theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg {
    width: 15px;
    height: 15px;
    fill: ${theme.colors.primaryText};
  }
`;

const Title = styled.h1`
  font-size: 1.05rem;
  font-weight: 700;
  color: ${theme.colors.textPrimary};
  margin: 0;
  letter-spacing: -0.02em;
  line-height: 1;

  @media (max-width: 480px) {
    font-size: 0.95rem;
  }
`;

const ActionsGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ThemeToggle = styled.button`
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.cardBorder};
  color: ${theme.colors.textSecondary};
  width: 34px;
  height: 34px;
  border-radius: 7px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: inherit;

  &:hover {
    color: ${theme.colors.textPrimary};
    background: ${theme.colors.surfaceHover};
    border-color: ${theme.colors.cardBorderHover};
  }

  svg {
    width: 15px;
    height: 15px;
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 0;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;

  @media (max-width: 640px) {
    padding: 0 1rem;
  }
`;

const NavLink = styled.button<{ active: boolean }>`
  background: transparent;
  border: none;
  border-bottom: 2px solid ${({ active }) => (active ? theme.colors.textPrimary : "transparent")};
  color: ${({ active }) => (active ? theme.colors.textPrimary : theme.colors.textMuted)};
  padding: 0.6rem 1rem;
  font-size: 0.825rem;
  font-weight: 500;
  cursor: pointer;
  font-family: inherit;
  display: flex;
  align-items: center;
  gap: 0.4rem;

  &:hover {
    color: ${theme.colors.textPrimary};
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

interface NavbarProps {
  onOpenAddModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAddModal }) => {
  const dispatch = useAppDispatch();
  const themeMode = useAppSelector((state) => state.songs.themeMode);
  const currentPage = useAppSelector((state) => state.songs.currentPage);

  return (
    <StickyNav>
      <NavTop>
        <Brand>
          <LogoMark>
            <svg viewBox="0 0 24 24">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
            </svg>
          </LogoMark>
          <Title>Melodex</Title>
        </Brand>

        <ActionsGroup>
          <ThemeToggle
            onClick={() => dispatch(toggleThemeMode())}
            title={`Switch to ${themeMode === "dark" ? "Light" : "Dark"} Mode`}
            aria-label="Toggle theme mode"
          >
            {themeMode === "dark" ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            )}
          </ThemeToggle>

          <Button variant="primary" size="md" onClick={onOpenAddModal}>
            + Add Song
          </Button>
        </ActionsGroup>
      </NavTop>

      <NavLinks>
        <NavLink
          active={currentPage === "songs"}
          onClick={() => dispatch(setCurrentPage("songs"))}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18V5l12-2v13"></path>
            <circle cx="6" cy="18" r="3"></circle>
            <circle cx="18" cy="16" r="3"></circle>
          </svg>
          Songs
        </NavLink>
        <NavLink
          active={currentPage === "analytics"}
          onClick={() => dispatch(setCurrentPage("analytics"))}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="20" x2="18" y2="10"></line>
            <line x1="12" y1="20" x2="12" y2="4"></line>
            <line x1="6" y1="20" x2="6" y2="14"></line>
          </svg>
          Analytics
        </NavLink>
      </NavLinks>
    </StickyNav>
  );
};