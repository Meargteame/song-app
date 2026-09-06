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

// Distinct album cover gradient generator based on title hash
const getCoverGradient = (title: string, index: number) => {
  const gradients = [
    "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
    "linear-gradient(135deg, #0284c7 0%, #2563eb 100%)",
    "linear-gradient(135deg, #059669 0%, #0d9488 100%)",
    "linear-gradient(135deg, #d97706 0%, #ea580c 100%)",
    "linear-gradient(135deg, #db2777 0%, #9333ea 100%)",
    "linear-gradient(135deg, #e11d48 0%, #c026d3 100%)",
  ];
  let hash = 0;
  for (let i = 0; i < title.length; i++) hash += title.charCodeAt(i);
  return gradients[(hash + index) % gradients.length];
};

const Card = styled.div<{ isSelected: boolean; isPlaying: boolean }>`
  background: ${theme.colors.cardBg};
  border: 1px solid
    ${({ isSelected, isPlaying }) =>
      isSelected
        ? "#38bdf8"
        : isPlaying
        ? "rgba(168, 85, 247, 0.6)"
        : theme.colors.cardBorder};
  border-radius: 14px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: ${({ isPlaying }) =>
    isPlaying
      ? "0 8px 30px -4px rgba(168, 85, 247, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1)"
      : theme.shadows.card};
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  backdrop-filter: blur(12px);

  &:hover {
    border-color: ${({ isSelected }) =>
      isSelected ? "#38bdf8" : "rgba(255, 255, 255, 0.18)"};
    transform: translateY(-3px);
    box-shadow: ${theme.shadows.cardHover};
  }
`;

const CardTop = styled.div`
  display: flex;
  gap: 0.95rem;
  margin-bottom: 0.95rem;
  align-items: flex-start;
`;

const ArtContainer = styled.div<{ bgGradient: string; coverImg?: string }>`
  width: 68px;
  height: 68px;
  border-radius: 12px;
  background: ${({ coverImg, bgGradient }) =>
    coverImg ? `url("${coverImg}") center/cover no-repeat` : bgGradient};
  position: relative;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.12);
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);

  /* Vinyl center dot if no cover art */
  &::after {
    content: "";
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: ${({ coverImg }) =>
      coverImg ? "transparent" : "rgba(0, 0, 0, 0.5)"};
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  &:hover .play-overlay {
    opacity: 1;
  }
`;

const PlayOverlay = styled.div<{ isCurrentlyPlaying: boolean }>`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 1.35rem;
  opacity: ${({ isCurrentlyPlaying }) => (isCurrentlyPlaying ? 1 : 0)};
  transition: opacity 0.2s ease;
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
  margin: 0 0 0.25rem 0;
  font-family: ${theme.fonts.heading};
  font-size: 1.05rem;
  font-weight: 700;
  color: #ffffff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  letter-spacing: -0.01em;
`;

const ArtistName = styled.p`
  margin: 0;
  font-size: 0.82rem;
  font-weight: 500;
  color: ${theme.colors.textSecondary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const HeartButton = styled.button<{ isFav?: boolean }>`
  background: transparent;
  border: none;
  color: ${({ isFav }) => (isFav ? "#f43f5e" : "rgba(255,255,255,0.25)")};
  cursor: pointer;
  padding: 0.2rem;
  font-size: 1.15rem;
  line-height: 1;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);

  &:hover {
    transform: scale(1.25);
    color: #f43f5e;
  }
`;

const SelectCheckbox = styled.input`
  margin-top: 0.35rem;
  cursor: pointer;
  accent-color: #38bdf8;
  width: 15px;
  height: 15px;
`;

const InfoPillsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.45rem;
  margin-bottom: 0.95rem;
`;

const GenreTag = styled.span`
  padding: 0.22rem 0.6rem;
  font-size: 0.73rem;
  font-weight: 600;
  background: rgba(139, 92, 246, 0.12);
  color: #c084fc;
  border: 1px solid rgba(139, 92, 246, 0.25);
  border-radius: 6px;
`;

const Pill = styled.span`
  padding: 0.22rem 0.55rem;
  font-size: 0.73rem;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.04);
  color: ${theme.colors.textSecondary};
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 6px;
`;

const DetailsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  margin-bottom: 0.95rem;
  padding: 0.65rem 0.85rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 8px;
`;

const DetailItem = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.78rem;
  color: ${theme.colors.textMuted};

  span:last-of-type {
    color: #e4e4e7;
    font-weight: 500;
    max-width: 140px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const ActionRow = styled.div`
  display: flex;
  gap: 0.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  padding-top: 0.85rem;
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
    <Card isSelected={isSelected} isPlaying={isCurrentlyPlaying}>
      <div>
        <CardTop>
          <SelectCheckbox
            type="checkbox"
            checked={isSelected}
            onChange={() => dispatch(toggleSelectSong(song._id))}
            title="Select for batch operations"
          />

          <ArtContainer
            bgGradient={getCoverGradient(song.title, 0)}
            coverImg={song.coverArt}
            onClick={handlePlayClick}
            title={isCurrentlyPlaying ? "Click to Pause" : "Click to Play"}
          >
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
              style={{
                cursor: "pointer",
                color: "#38bdf8",
                borderColor: "rgba(56,189,248,0.3)",
                background: "rgba(56,189,248,0.08)",
              }}
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
            <span>{formatDate(song.createdAt)}</span>
          </DetailItem>
        </DetailsList>
      </div>

      <ActionRow>
        <Button
          variant="secondary"
          size="sm"
          style={{ flex: 1 }}
          onClick={() => onEdit(song)}
        >
          ✏️ Edit
        </Button>
        <Button
          variant="danger"
          size="sm"
          style={{ flex: 1 }}
          onClick={() => onDelete(song._id)}
        >
          🗑️ Delete
        </Button>
      </ActionRow>
    </Card>
  );
};