import React from "react";
import styled from "@emotion/styled";
import { Song } from "../types";
import { theme, Button } from "../styles";

const Card = styled.div`
  background: ${theme.colors.cardBg};
  border: 1px solid ${theme.colors.cardBorder};
  border-radius: 10px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: ${theme.shadows.card};
  transition: border-color 0.15s ease, transform 0.15s ease;

  &:hover {
    border-color: ${theme.colors.cardBorderHover};
    transform: translateY(-2px);
  }
`;

const SongTitle = styled.h3`
  margin: 0 0 0.25rem 0;
  font-size: 1.05rem;
  font-weight: 600;
  color: ${theme.colors.textPrimary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ArtistName = styled.p`
  margin: 0 0 1rem 0;
  font-size: 0.875rem;
  font-weight: 400;
  color: ${theme.colors.textSecondary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const DetailsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  margin-bottom: 1rem;
  padding: 0.75rem;
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.cardBorder};
  border-radius: 6px;
`;

const DetailItem = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: ${theme.colors.textMuted};

  span:last-of-type {
    color: ${theme.colors.textSecondary};
    font-weight: 500;
    max-width: 140px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const GenreTag = styled.span`
  display: inline-block;
  align-self: flex-start;
  padding: 0.25rem 0.6rem;
  font-size: 0.75rem;
  font-weight: 500;
  background: ${theme.colors.tagBg};
  color: ${theme.colors.tagText};
  border: 1px solid ${theme.colors.tagBorder};
  border-radius: 4px;
`;

const ActionRow = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1.25rem;
  border-top: 1px solid ${theme.colors.cardBorder};
  padding-top: 0.85rem;
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
        <SongTitle title={song.title}>{song.title}</SongTitle>
        <ArtistName title={song.artist}>{song.artist}</ArtistName>

        <DetailsList>
          <DetailItem>
            <span>Album</span>
            <span title={song.album}>{song.album}</span>
          </DetailItem>
          <DetailItem>
            <span>Added</span>
            <span>{new Date(song.createdAt).toLocaleDateString()}</span>
          </DetailItem>
        </DetailsList>

        <GenreTag>{song.genre}</GenreTag>
      </div>

      <ActionRow>
        <Button
          variant="secondary"
          size="sm"
          style={{ flex: 1 }}
          onClick={() => onEdit(song)}
        >
          Edit
        </Button>
        <Button
          variant="danger"
          size="sm"
          style={{ flex: 1 }}
          onClick={() => onDelete(song._id)}
        >
          Delete
        </Button>
      </ActionRow>
    </Card>
  );
};