import React from "react";
import styled from "@emotion/styled";
import { theme, Button } from "../styles";
import { useAppDispatch } from "../store/hooks";
import { setExportImportOpen } from "../store/slices/songSlice";

const Nav = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0 1.75rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1.25rem;
`;

const LeftBrand = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const LogoIcon = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: ${theme.colors.primaryGradient};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.35rem;
  box-shadow: 0 4px 20px -2px rgba(168, 85, 247, 0.4);
  flex-shrink: 0;
`;

const TitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
`;

const Title = styled.h1`
  font-family: ${theme.fonts.heading};
  font-size: 1.65rem;
  font-weight: 800;
  color: ${theme.colors.textPrimary};
  margin: 0;
  letter-spacing: -0.03em;
  background: linear-gradient(135deg, #ffffff 30%, #c084fc 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const SubtitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const LiveBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.72rem;
  font-weight: 600;
  color: #4ade80;
  background: rgba(34, 197, 94, 0.12);
  border: 1px solid rgba(34, 197, 94, 0.25);
  padding: 0.1rem 0.45rem;
  border-radius: 9999px;

  &::before {
    content: "";
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #4ade80;
    box-shadow: 0 0 8px #4ade80;
  }
`;

const Subtitle = styled.span`
  font-size: 0.8rem;
  color: ${theme.colors.textMuted};
  font-weight: 500;
`;

const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

interface NavbarProps {
  onOpenAddModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAddModal }) => {
  const dispatch = useAppDispatch();

  return (
    <Nav>
      <LeftBrand>
        <LogoIcon>🎵</LogoIcon>
        <TitleGroup>
          <Title>SongStudio</Title>
          <SubtitleRow>
            <LiveBadge>Cloud Sync</LiveBadge>
            <Subtitle>MERN Music Catalog & Analytics</Subtitle>
          </SubtitleRow>
        </TitleGroup>
      </LeftBrand>

      <ButtonGroup>
        <Button
          variant="secondary"
          size="md"
          onClick={() => dispatch(setExportImportOpen(true))}
          title="Export CSV/JSON or Import songs"
        >
          ⚡ Backup / Export
        </Button>
        <Button variant="gradient" size="md" onClick={onOpenAddModal}>
          + Add New Song
        </Button>
      </ButtonGroup>
    </Nav>
  );
};