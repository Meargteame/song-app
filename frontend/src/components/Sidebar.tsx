import React from "react";
import styled from "@emotion/styled";
import { theme, Button } from "../styles";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { toggleThemeMode, setCurrentPage, setActiveTab } from "../store/slices/songSlice";

const SidebarContainer = styled.aside`
  width: 240px;
  background: ${theme.colors.surface};
  border-right: 1px solid ${theme.colors.cardBorder};
  display: flex;
  flex-direction: column;
  height: calc(100vh - 90px);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 900;
  padding: 1.25rem 1rem;
  box-sizing: border-box;

  @media (max-width: 768px) {
    width: 70px;
    padding: 1rem 0.5rem;
  }

  @media (max-width: 640px) {
    position: fixed;
    top: auto;
    bottom: 80px;
    left: 0;
    right: 0;
    width: 100%;
    height: 54px;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
    padding: 0 0.5rem;
    border-right: none;
    border-top: 1px solid ${theme.colors.cardBorder};
    background: var(--player-bg);
    backdrop-filter: blur(16px);
  }
`;

const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.75rem;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    justify-content: center;
    padding: 0.5rem 0;
  }

  @media (max-width: 640px) {
    display: none;
  }
`;

const LogoIcon = styled.div`
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: var(--music-accent);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg {
    width: 18px;
    height: 18px;
    fill: #000000;
  }
`;

const BrandText = styled.h1`
  font-size: 1.15rem;
  font-weight: 800;
  color: ${theme.colors.textPrimary};
  margin: 0;
  letter-spacing: -0.02em;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavSection = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;

  @media (max-width: 640px) {
    flex-direction: row;
    width: 100%;
    justify-content: space-around;
    align-items: center;
    gap: 0;
  }
`;

const NavSectionLabel = styled.div`
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${theme.colors.textMuted};
  padding: 0.5rem 0.75rem 0.25rem 0.75rem;
  margin-top: 0.75rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavItem = styled.button<{ active: boolean }>`
  background: ${({ active }) => (active ? "var(--bg-surface-hover)" : "transparent")};
  color: ${({ active }) => (active ? "var(--music-accent)" : theme.colors.textSecondary)};
  border: none;
  border-radius: 8px;
  padding: 0.65rem 0.75rem;
  font-size: 0.875rem;
  font-weight: ${({ active }) => (active ? "700" : "500")};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.85rem;
  width: 100%;
  text-align: left;
  transition: all 0.15s ease;
  font-family: inherit;

  &:hover {
    color: ${theme.colors.textPrimary};
    background: ${theme.colors.surfaceHover};
  }

  svg {
    width: 20px;
    height: 20px;
    stroke: currentColor;
    stroke-width: 2;
    fill: none;
    flex-shrink: 0;
  }

  @media (max-width: 768px) {
    justify-content: center;
    padding: 0.65rem 0;

    span {
      display: none;
    }
  }

  @media (max-width: 640px) {
    padding: 0.4rem;
    width: auto;
    border-radius: 50%;
  }
`;

const BottomSection = styled.div`
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid ${theme.colors.cardBorder};
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  @media (max-width: 640px) {
    display: none;
  }
`;

const QuickStatsBox = styled.div`
  background: ${theme.colors.cardBg};
  border: 1px solid ${theme.colors.cardBorder};
  border-radius: 10px;
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

const StatRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: ${theme.colors.textMuted};

  span:last-child {
    font-weight: 700;
    color: ${theme.colors.textPrimary};
  }
`;

interface SidebarProps {
  onOpenAddModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenAddModal }) => {
  const dispatch = useAppDispatch();
  const { currentPage, activeTab, themeMode, statistics } = useAppSelector(
    (state) => state.songs
  );

  return (
    <SidebarContainer>
      <Brand>
        <LogoIcon>
          <svg viewBox="0 0 24 24">
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
          </svg>
        </LogoIcon>
        <BrandText>AuraTune</BrandText>
      </Brand>

      <Button
        variant="primary"
        onClick={onOpenAddModal}
        style={{
          width: "100%",
          marginBottom: "1rem",
          borderRadius: "20px",
          fontWeight: 700,
          padding: "0.6rem 1rem",
        }}
      >
        + Add Song
      </Button>

      <NavSection>
        <NavSectionLabel>Menu</NavSectionLabel>
        <NavItem
          active={currentPage === "home"}
          onClick={() => dispatch(setCurrentPage("home"))}
        >
          <svg viewBox="0 0 24 24">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          <span>Home</span>
        </NavItem>

        <NavItem
          active={currentPage === "songs" && activeTab === "all"}
          onClick={() => {
            dispatch(setCurrentPage("songs"));
            dispatch(setActiveTab("all"));
          }}
        >
          <svg viewBox="0 0 24 24">
            <path d="M9 18V5l12-2v13"></path>
            <circle cx="6" cy="18" r="3"></circle>
            <circle cx="18" cy="16" r="3"></circle>
          </svg>
          <span>Songs Library</span>
        </NavItem>

        <NavItem
          active={currentPage === "playlists"}
          onClick={() => dispatch(setCurrentPage("playlists"))}
        >
          <svg viewBox="0 0 24 24">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
          </svg>
          <span>Playlists</span>
        </NavItem>

        <NavItem
          active={currentPage === "songs" && activeTab === "favorites"}
          onClick={() => {
            dispatch(setCurrentPage("songs"));
            dispatch(setActiveTab("favorites"));
          }}
        >
          <svg viewBox="0 0 24 24">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
          <span>Favorites</span>
        </NavItem>

        <NavItem
          active={currentPage === "analytics"}
          onClick={() => dispatch(setCurrentPage("analytics"))}
        >
          <svg viewBox="0 0 24 24">
            <line x1="18" y1="20" x2="18" y2="10"></line>
            <line x1="12" y1="20" x2="12" y2="4"></line>
            <line x1="6" y1="20" x2="6" y2="14"></line>
          </svg>
          <span>Analytics Hub</span>
        </NavItem>
      </NavSection>

      <BottomSection>
        {statistics && (
          <QuickStatsBox>
            <StatRow>
              <span>Total Songs</span>
              <span>{statistics.totalSongs}</span>
            </StatRow>
            <StatRow>
              <span>Artists</span>
              <span>{statistics.totalArtists ?? statistics.songsPerArtist.length}</span>
            </StatRow>
            <StatRow>
              <span>Albums</span>
              <span>{statistics.totalAlbums ?? statistics.songsPerAlbum.length}</span>
            </StatRow>
          </QuickStatsBox>
        )}

        <NavItem
          active={false}
          onClick={() => dispatch(toggleThemeMode())}
          title={`Switch to ${themeMode === "dark" ? "Light" : "Dark"} Mode`}
        >
          {themeMode === "dark" ? (
            <svg viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          )}
          <span>{themeMode === "dark" ? "Light Mode" : "Dark Mode"}</span>
        </NavItem>
      </BottomSection>
    </SidebarContainer>
  );
};
