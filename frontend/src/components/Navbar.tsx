import React from "react";
import styled from "@emotion/styled";
import { theme, Button } from "../styles";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { toggleThemeMode } from "../store/slices/songSlice";

const StickyNav = styled.nav`
  position: sticky;
  top: 0;
  z-index: 900;
  background: ${theme.colors.background};
  border-bottom: 1px solid ${theme.colors.cardBorder};
  padding: 0.85rem 0;
  margin: -2.5rem -1.5rem 2rem -1.5rem;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  backdrop-filter: blur(12px);

  @media (max-width: 640px) {
    margin: -2.5rem -1rem 1.5rem -1rem;
    padding-left: 1rem;
    padding-right: 1rem;
  }
`;

const NavInner = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  flex-wrap: wrap;
  gap: 0.75rem;
`;

const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 0.65rem;
`;

const LogoMark = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: ${theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg {
    width: 16px;
    height: 16px;
    fill: ${theme.colors.primaryText};
  }
`;

const BrandText = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.h1`
  font-size: 1.1rem;
  font-weight: 700;
  color: ${theme.colors.textPrimary};
  margin: 0;
  letter-spacing: -0.02em;
  line-height: 1.2;

  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

const Subtitle = styled.span`
  font-size: 0.72rem;
  color: ${theme.colors.textMuted};
  font-weight: 400;
  letter-spacing: 0.01em;
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
  width: 36px;
  height: 36px;
  border-radius: 8px;
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
    width: 16px;
    height: 16px;
  }
`;

interface NavbarProps {
  onOpenAddModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAddModal }) => {
  const dispatch = useAppDispatch();
  const themeMode = useAppSelector((state) => state.songs.themeMode);

  return (
    <StickyNav>
      <NavInner>
        <Brand>
          <LogoMark>
            <svg viewBox="0 0 24 24">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
            </svg>
          </LogoMark>
          <BrandText>
            <Title>Song Management</Title>
            <Subtitle>Catalog & Aggregated Metrics</Subtitle>
          </BrandText>
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
      </NavInner>
    </StickyNav>
  );
};