import React from "react";
import styled from "@emotion/styled";
import { Song } from "../types";
import { theme } from "../styles";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  playSong,
  togglePlayPause,
  toggleFavoriteStart,
  toggleSelectSong,
  setActiveLyricsSong,
} from "../store/slices/songSlice";
import { getSongCover } from "../utils/coverArt";

const Card = styled.div<{ isSelected: boolean }>`
  background: ${theme.colors.cardBg};
  border: 1px solid
    ${({ isSelected }) =>
      isSelected ? "var(--music-accent)" : theme.colors.cardBorder};
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  box-shadow: ${theme.shadows.card};
  position: relative;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;

  &:hover {
    border-color: ${theme.colors.cardBorderHover};
    transform: translateY(-4px);
    box-shadow: ${theme.shadows.cardHover};
  }
`;

const ArtworkWrapper = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 0.85rem;
  background: ${theme.colors.surface};
`;

const ArtworkImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;

  ${Card}:hover & {
    transform: scale(1.05);
  }
`;

const PlayOverlay = styled.div<{ isPlaying: boolean }>`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${({ isPlaying }) => (isPlaying ? 1 : 0)};
  transition: opacity 0.25s ease;

  ${Card}:hover & {
    opacity: 1;
  }
`;

const CircularPlayBtn = styled.button<{ isPlaying: boolean }>`
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background: var(--music-accent);
  color: #ffffff;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 8px 20px rgba(16, 185, 129, 0.4);
  transform: ${({ isPlaying }) => (isPlaying ? "scale(1)" : "translateY(8px)")};
  transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);

  ${Card}:hover & {
    transform: scale(1);
  }

  &:hover {
    background: var(--music-accent-hover);
    transform: scale(1.1) !important;
  }

  svg {
    width: 20px;
    height: 20px;
    fill: currentColor;
    margin-left: ${({ isPlaying }) => (isPlaying ? "0" : "2px")};
  }
`;

const FavoriteBadge = styled.button<{ isFav?: boolean }>`
  position: absolute;
  top: 0.65rem;
  right: 0.65rem;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: ${({ isFav }) => (isFav ? "#f43f5e" : "#ffffff")};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 2;

  &:hover {
    transform: scale(1.1);
    color: #f43f5e;
    background: rgba(0, 0, 0, 0.75);
  }

  svg {
    width: 16px;
    height: 16px;
    fill: ${({ isFav }) => (isFav ? "currentColor" : "none")};
    stroke: currentColor;
    stroke-width: 2;
  }
`;

const SelectCheckbox = styled.label`
  position: absolute;
  top: 0.65rem;
  left: 0.65rem;
  z-index: 2;
  cursor: pointer;

  input {
    width: 18px;
    height: 18px;
    cursor: pointer;
    accent-color: var(--music-accent);
    border-radius: 4px;
  }
`;

const MetaContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-bottom: 0.75rem;
`;

const SongTitle = styled.h3`
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: ${theme.colors.textPrimary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  letter-spacing: -0.01em;
`;

const ArtistName = styled.p`
  margin: 0;
  font-size: 0.85rem;
  color: ${theme.colors.textSecondary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 500;
`;

const AlbumRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: ${theme.colors.textMuted};
  margin-top: 0.1rem;
`;

const AlbumName = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 160px;
`;

const TagsRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin-top: 0.35rem;
`;

const GenreTag = styled.span`
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  background: ${theme.colors.tagBg};
  color: ${theme.colors.tagText};
  border: 1px solid ${theme.colors.tagBorder};
`;

const DurationBadge = styled.span`
  font-size: 0.75rem;
  font-weight: 500;
  color: ${theme.colors.textMuted};
  font-variant-numeric: tabular-nums;
`;

const ActionsFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.4rem;
  padding-top: 0.75rem;
  border-top: 1px solid ${theme.colors.cardBorder};
  margin-top: auto;
`;

const SmallBtn = styled.button<{ variant?: "danger" | "ghost" }>`
  background: ${({ variant }) =>
    variant === "danger" ? theme.colors.dangerBg : "transparent"};
  color: ${({ variant }) =>
    variant === "danger" ? theme.colors.danger : theme.colors.textSecondary};
  border: 1px solid
    ${({ variant }) =>
      variant === "danger" ? theme.colors.dangerBorder : "transparent"};
  border-radius: 6px;
  padding: 0.3rem 0.6rem;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  transition: all 0.15s ease;

  &:hover {
    color: ${({ variant }) =>
      variant === "danger" ? "#ffffff" : theme.colors.textPrimary};
    background: ${({ variant }) =>
      variant === "danger" ? theme.colors.danger : theme.colors.surfaceHover};
  }

  svg {
    width: 13px;
    height: 13px;
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
  const coverUrl = getSongCover(song.title, song.genre, song.coverArt);

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCurrent) {
      dispatch(togglePlayPause());
    } else {
      dispatch(playSong(song));
    }
  };

  return (
    <Card isSelected={isSelected}>
      <ArtworkWrapper>
        <ArtworkImage src={coverUrl} alt={song.title} loading="lazy" />

        <SelectCheckbox title="Select song" onClick={(e) => e.stopPropagation()}>
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => dispatch(toggleSelectSong(song._id))}
          />
        </SelectCheckbox>

        <FavoriteBadge
          isFav={song.isFavorite}
          onClick={(e) => {
            e.stopPropagation();
            dispatch(toggleFavoriteStart(song._id));
          }}
          title={song.isFavorite ? "Remove favorite" : "Add favorite"}
        >
          <svg viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </FavoriteBadge>

        <PlayOverlay isPlaying={isCurrentlyPlaying}>
          <CircularPlayBtn isPlaying={isCurrentlyPlaying} onClick={handlePlay} title={isCurrentlyPlaying ? "Pause" : "Play"}>
            {isCurrentlyPlaying ? (
              <svg viewBox="0 0 24 24">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </CircularPlayBtn>
        </PlayOverlay>
      </ArtworkWrapper>

      <MetaContainer>
        <SongTitle title={song.title}>{song.title}</SongTitle>
        <ArtistName title={song.artist}>{song.artist}</ArtistName>

        <AlbumRow>
          <AlbumName title={song.album}>{song.album}</AlbumName>
          {song.releaseYear && <span>{song.releaseYear}</span>}
        </AlbumRow>

        <TagsRow>
          <GenreTag>{song.genre}</GenreTag>
          {song.duration && <DurationBadge>{song.duration}</DurationBadge>}
        </TagsRow>
      </MetaContainer>

      <ActionsFooter>
        {song.lyrics ? (
          <SmallBtn onClick={() => dispatch(setActiveLyricsSong(song))} title="View Lyrics">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
            </svg>
            Lyrics
          </SmallBtn>
        ) : (
          <span />
        )}

        <div style={{ display: "flex", gap: "0.3rem" }}>
          <SmallBtn onClick={() => onEdit(song)} title="Edit Song">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
            Edit
          </SmallBtn>

          <SmallBtn variant="danger" onClick={() => onDelete(song._id)} title="Delete Song">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </SmallBtn>
        </div>
      </ActionsFooter>
    </Card>
  );
};