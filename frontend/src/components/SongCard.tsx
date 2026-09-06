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

const Card = styled.div<{ isSelected: boolean }>`
  background: ${theme.colors.cardBg};
  border: 1px solid
    ${({ isSelected }) =>
      isSelected ? "#38bdf8" : theme.colors.cardBorder};
  border-radius: 12px;
  padding: 1.15rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: ${theme.shadows.card};
  transition: all 0.15s ease;
  position: relative;

  &:hover {
    border-color: ${({ isSelected }) =>
      isSelected ? "#38bdf8" : theme.colors.cardBorderHover};
    transform: translateY(-2px);
  }
`;

const CardTop = styled.div`
  display: flex;
  gap: 0.85rem;
  margin-bottom: 0.85rem;
  align-items: flex-start;
`;

const ArtContainer = styled.div<{ bg?: string }>`
  width: 64px;
  height: 64px;
  border-radius: 8px;
  background: ${({ bg }) => bg || "#1f1f23"};
  background-size: cover;
  background-position: center;
  position: relative;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${theme.colors.cardBorder};
  overflow: hidden;
  cursor: pointer;

  &:hover .play-overlay {
    opacity: 1;
  }
`;

const PlayOverlay = styled.div<{ isCurrentlyPlaying: boolean }>`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 1.25rem;
  opacity: ${({ isCurrentlyPlaying }) => (isCurrentlyPlaying ? 1 : 0)};
  transition: opacity 0.15s ease;
`;

const HeaderMeta = styled.div`
  flex: 1;
  overflow: hidden;
`;

const TitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.4rem;
`;

const SongTitle = styled.h3`
  margin: 0 0 0.2rem 0;
  font-size: 0.95rem;
  font-weight: 600;
  color: ${theme.colors.textPrimary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ArtistName = styled.p`
  margin: 0;
  font-size: 0.8rem;
  color: ${theme.colors.textSecondary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const HeartButton = styled.button<{ isFav?: boolean }>`
  background: transparent;
  border: none;
  color: ${({ isFav }) => (isFav ? "#f43f5e" : theme.colors.textMuted)};
  cursor: pointer;
  padding: 0.2rem;
  font-size: 1.05rem;
  line-height: 1;
  transition: transform 0.15s ease, color 0.15s ease;

  &:hover {
    transform: scale(1.2);
    color: #f43f5e;
  }
`;

const SelectCheckbox = styled.input`
  margin-right: 0.2rem;
  cursor: pointer;
  accent-color: #38bdf8;
`;

const InfoPillsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.4rem;
  margin-bottom: 0.85rem;
`;

const GenreTag = styled.span`
  padding: 0.2rem 0.5rem;
  font-size: 0.72rem;
  font-weight: 500;
  background: ${theme.colors.tagBg};
  color: ${theme.colors.tagText};
  border: 1px solid ${theme.colors.tagBorder};
  border-radius: 4px;
`;

const Pill = styled.span`
  padding: 0.2rem 0.45rem;
  font-size: 0.72rem;
  background: ${theme.colors.surface};
  color: ${theme.colors.textMuted};
  border: 1px solid ${theme.colors.cardBorder};
  border-radius: 4px;
`;

const DetailsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  margin-bottom: 0.85rem;
  padding: 0.6rem 0.75rem;
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.cardBorder};
  border-radius: 6px;
`;

const DetailItem = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
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

const ActionRow = styled.div`
  display: flex;
  gap: 0.4rem;
  border-top: 1px solid ${theme.colors.cardBorder};
  padding-top: 0.75rem;
  align-items: center;
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

  const handlePlayClick = () => {
    if (isCurrent) {
      dispatch(togglePlayPause());
    } else {
      dispatch(playSong(song));
    }
  };

  const handleFavoriteToggle = () => {
    dispatch(toggleFavoriteStart(song._id));
  };

  const handleLyricsClick = () => {
    dispatch(setActiveLyricsSong(song));
  };

  return (
    <Card isSelected={isSelected}>
      <div>
        <CardTop>
          <SelectCheckbox
            type="checkbox"
            checked={isSelected}
            onChange={() => dispatch(toggleSelectSong(song._id))}
            title="Select for batch operations"
          />

          <ArtContainer
            bg={song.coverArt ? `url("${song.coverArt}")` : undefined}
            onClick={handlePlayClick}
            title={isCurrentlyPlaying ? "Click to Pause" : "Click to Play"}
          >
            {!song.coverArt && <span style={{ fontSize: "1.2rem" }}>💿</span>}
            <PlayOverlay className="play-overlay" isCurrentlyPlaying={isCurrentlyPlaying}>
              {isCurrentlyPlaying ? "⏸" : "▶"}
            </PlayOverlay>
          </ArtContainer>

          <HeaderMeta>
            <TitleRow>
              <SongTitle title={song.title}>{song.title}</SongTitle>
              <HeartButton
                isFav={song.isFavorite}
                onClick={handleFavoriteToggle}
                title={song.isFavorite ? "Remove from Favorites" : "Add to Favorites"}
              >
                {song.isFavorite ? "❤️" : "🤍"}
              </HeartButton>
            </TitleRow>
            <ArtistName title={song.artist}>{song.artist}</ArtistName>
          </HeaderMeta>
        </CardTop>

        <InfoPillsRow>
          <GenreTag>{song.genre}</GenreTag>
          {song.duration && <Pill>⏱ {song.duration}</Pill>}
          {song.releaseYear && <Pill>📅 {song.releaseYear}</Pill>}
          {song.lyrics && (
            <Pill
              style={{ cursor: "pointer", color: "#38bdf8", borderColor: "rgba(56,189,248,0.3)" }}
              onClick={handleLyricsClick}
            >
              📝 Lyrics
            </Pill>
          )}
        </InfoPillsRow>

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
      </div>

      <ActionRow>
        <Button
          variant="outline"
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