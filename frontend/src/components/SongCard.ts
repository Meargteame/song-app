import React from "react";
import styled from "@emotion/styled";
import { Song } from "../types";
import { theme, Button } from "../styles";

const Card = styled.div`
  background: ${theme.colors.cardBg};
  border: 1px solid ${theme.colors.cardBorder};
  border-radius: 12px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.2s ease, border-color 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    border-color: ${theme.colors.primary};
  }
`;

const SongTitle = styled.h3`
  margin: 0 0 0.5rem 0;
  font-size: 1.15rem;
  color: ${theme.colors.textPrimary};
`;

const InfoRow = styled.p`
  margin: 0.25rem 0;
  font-size: 0.875rem;
  color: ${theme.colors.textSecondary};

  span {
    color: ${theme.colors.textPrimary};
    font-weight: 500;
  }
`;

const GenreTag = styled.span`
  display: inline-block;
  align-self: flex-start;
  margin-top: 0.75rem;
  padding: 0.25rem 0.6rem;
  font-size: 0.75rem;
  font-weight: 600;
  background: rgba(99, 102, 241, 0.15);
  color: ${theme.colors.accent};
  border-radius: 6px;
`;

const ActionRow = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1.25rem;
`;

interface SongCardProps {
  song: Song;
  onEdit: (song: Song) => void;
  onDelete: (id: string) => void;
}

export const SongCard: React.FC<SongCardProps> = ({ song, onEdit, onDelete }) => {
  return (
    <Card>
      <div>
        <SongTitle>{song.title}</SongTitle>
        <InfoRow>
          Artist: <span>{song.artist}</span>
        </InfoRow>
        <InfoRow>
          Album: <span>{song.album}</span>
        </InfoRow>
        <GenreTag>{song.genre}</GenreTag>
      </div>

      <ActionRow>
        <Button variant="secondary" onClick={() => onEdit(song)}>
          Edit
        </Button>
        <Button variant="danger" onClick={() => onDelete(song._id)}>
          Delete
        </Button>
      </ActionRow>
    </Card>
  );
};