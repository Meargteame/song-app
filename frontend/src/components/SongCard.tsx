import React from "react";
import styled from "@emotion/styled";
import { Song } from "../types";
import { theme, Button } from "../styles";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  playSong,
  togglePlayPause,
  toggleFavoriteStart,
  toggleSelectSong,
  setActiveLyricsSong,
} from "../store/slices/songSlice";
import { formatDate } from "../utils/formatters";

const Card = styled.div<{ isSelected: boolean }>`
  background: ${theme.colors.cardBg};
  border: 1px solid
    ${({ isSelected }) =>
      isSelected ? "#52525b" : theme.colors.cardBorder};
  border-radius: 10px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: ${theme.shadows.card};
  transition: border-color 0.15s ease, transform 0.15s ease;
  position: relative;

  &:hover {
    border-color: ${theme.colors.cardBorderHover};
    transform: translateY(-2px);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
`;

const TitleGroup = styled.div`
  flex: 1;
  overflow: hidden;
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
  color: ${theme.colors.textSecondary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const FavoriteButton = styled.button<{ isFav?: boolean }>`
  background: transparent;
  border: none;
  color: ${({ isFav }) => (isFav ? "#f43f5e" : theme.colors.textMuted)};
  cursor: pointer;
  padding: 0.2rem;
  font-size: 1.1rem;
  line-height: 1;
  transition: transform 0.15s ease, color 0.15s ease;

  &:hover {
    color: #f43f5e;
    transform: scale(1.15);
  }
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
    max-width: 150px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const TagsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.4rem;
  margin-bottom: 1rem;
`;

const GenreTag = styled.span`
  display: inline-block;
  padding: 0.25rem 0.6rem;
  font-size: 0.75rem;
  font-weight: 500;
  background: ${theme.colors.tagBg};
  color: ${theme.colors.tagText};
  border: 1px solid ${theme.colors.tagBorder};
  border-radius: 4px;
`;

const SmallPill = styled.span`
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  color: ${theme.colors.textMuted};
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.cardBorder};
  border-radius: 4px;
`;

const ActionRow = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.25rem;
  border-top: 1px solid ${theme.colors.cardBorder};
  padding-top: 0.85rem;
  align-items: center;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-right: 0.35rem;

  input {
    cursor: pointer;
    accent-color: #52525b;
  }
`;

interface SongCardProps {
  song: Song;
  onEdit: (song: Song) => void;
  onDelete: (id: string) => void;
}

export const SongCard: React.FC<SongCardProps> = ({ song, onEdit, onDelete }) => {
  const dispatch = useAppDispatch();
  const { currentSong, isPlaying, selectedSongIds } = useAppSelector(
    (state) => state.songs
  );

  const isCurrent = currentSong?._id === song._id;
  const isCurrentlyPlaying = isCurrent && isPlaying;
  const isSelected = selectedSongIds.includes(song._id);

  const handlePlay = () => {
    if (isCurrent) {
      dispatch(togglePlayPause());
    } else {
      dispatch(playSong(song));
    }
  };

  return (
    <Card isSelected={isSelected}>
      <div>
        <CardHeader>
          <TitleGroup>
            <SongTitle title={song.title}>{song.title}</SongTitle>
            <ArtistName title={song.artist}>{song.artist}</ArtistName>
          </TitleGroup>
          <FavoriteButton
            isFav={song.isFavorite}
            onClick={() => dispatch(toggleFavoriteStart(song._id))}
            title={song.isFavorite ? "Remove from Favorites" : "Add to Favorites"}
          >
            {song.isFavorite ? "♥" : "♡"}
          </FavoriteButton>
        </CardHeader>

        <DetailsList>
          <DetailItem>
            <span>Album</span>
            <span title={song.album}>{song.album}</span>
          </DetailItem>
          {song.duration && (
            <DetailItem>
              <span>Duration</span>
              <span>{song.duration}</span>
            </DetailItem>
          )}
          {song.releaseYear && (
            <DetailItem>
              <span>Year</span>
              <span>{song.releaseYear}</span>
            </DetailItem>
          )}
          <DetailItem>
            <span>Added</span>
            <span>{formatDate(song.createdAt)}</span>
          </DetailItem>
        </DetailsList>

        <TagsRow>
          <GenreTag>{song.genre}</GenreTag>
          {song.lyrics && (
            <SmallPill
              style={{ cursor: "pointer", color: theme.colors.textSecondary }}
              onClick={() => dispatch(setActiveLyricsSong(song))}
            >
              Lyrics
            </SmallPill>
          )}
        </TagsRow>
      </div>

      <ActionRow>
        <CheckboxLabel title="Select for batch actions">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => dispatch(toggleSelectSong(song._id))}
          />
        </CheckboxLabel>

        <Button
          variant={isCurrentlyPlaying ? "primary" : "secondary"}
          size="sm"
          onClick={handlePlay}
          style={{ flex: 1 }}
        >
          {isCurrentlyPlaying ? "Pause" : "Play"}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(song)}
          style={{ flex: 1 }}
        >
          Edit
        </Button>

        <Button
          variant="danger"
          size="sm"
          onClick={() => onDelete(song._id)}
          style={{ flex: 1 }}
        >
          Delete
        </Button>
      </ActionRow>
    </Card>
  );
};