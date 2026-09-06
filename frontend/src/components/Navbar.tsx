import React from "react";
import styled from "@emotion/styled";
import { theme, Button } from "../styles";
import { useAppDispatch } from "../store/hooks";
import { setExportImportOpen } from "../store/slices/songSlice";

const Nav = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0 1.5rem 0;
  border-bottom: 1px solid ${theme.colors.cardBorder};
  margin-bottom: 1.75rem;
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
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Subtitle = styled.span`
  font-size: 0.85rem;
  color: ${theme.colors.textMuted};
  font-weight: 400;
`;

const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
`;

interface NavbarProps {
  onOpenAddModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAddModal }) => {
  const dispatch = useAppDispatch();

  return (
    <Nav>
      <TitleGroup>
        <Title>
          <span>🎵</span> SongStudio
        </Title>
        <Subtitle>Cloud Catalog & Analytics</Subtitle>
      </TitleGroup>

      <ButtonGroup>
        <Button
          variant="secondary"
          size="md"
          onClick={() => dispatch(setExportImportOpen(true))}
          title="Export CSV/JSON or Import songs"
        >
          ⚡ Backup & Export
        </Button>
        <Button variant="primary" size="md" onClick={onOpenAddModal}>
          + Add Song
        </Button>
      </ButtonGroup>
    </Nav>
  );
};