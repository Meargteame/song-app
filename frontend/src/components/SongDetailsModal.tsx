import React from "react";
import styled from "@emotion/styled";
import { Song } from "../types";
import { theme, Button } from "../styles";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { playSong, togglePlayPause, toggleFavoriteStart, addSongToPlaylist } from "../store/slices/songSlice";
import { getSongCover } from "../utils/coverArt";
import { formatDate } from "../utils/formatters";

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1250;
  padding: 1rem;
`;

const ModalCard = styled.div`
  background: ${theme.colors.cardBg};
  border: 1px solid ${theme.colors.cardBorderHover};
  border-radius: 16px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: ${theme.shadows.popover};
  overflow: hidden;
  box-sizing: border-box;
`;

const HeaderBanner = styled.div<{ bgCover: string }>`
  position: relative;
  height: 200px;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.3), ${theme.colors.cardBg}),
    url("${({ bgCover }) => bgCover}") center/cover no-repeat;
  display: flex;
  align-items: flex-end;
  padding: 1.5rem;
  box-sizing: border-box;
`;

const CloseBtn = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #ffffff;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  transition: all 0.15s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.85);
    transform: scale(1.1);
  }
`;

const HeroInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1.25rem;
  z-index: 2;
  width: 100%;
`;

const CoverThumb = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 12px;
  object-fit: cover;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6);
  border: 2px solid rgba(255, 255, 255, 0.15);
  flex-shrink: 0;
`;

const TitleMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  overflow: hidden;
`;

const TrackTitle = styled.h2`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 800;
  color: #ffffff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  letter-spacing: -0.02em;
`;

const ArtistSub = styled.p`
  margin: 0;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--music-accent);
`;

const ScrollContent = styled.div`
  padding: 1.5rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const ActionRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.85rem;
`;

const BigPlayButton = styled.button<{ isPlaying: boolean }>`
  background: var(--music-accent);
  color: #000000;
  border: none;
  border-radius: 30px;
  padding: 0.65rem 1.5rem;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 15px rgba(29, 185, 84, 0.4);
  transition: all 0.2s ease;

  &:hover {
    background: var(--music-accent-hover);
    transform: scale(1.05);
  }

  svg {
    width: 18px;
    height: 18px;
    fill: currentColor;
  }
`;

const HeartCircleBtn = styled.button<{ isFav?: boolean }>`
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.cardBorder};
  color: ${({ isFav }) => (isFav ? "#f43f5e" : theme.colors.textSecondary)};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    color: #f43f5e;
    transform: scale(1.1);
  }

  svg {
    width: 20px;
    height: 20px;
    fill: ${({ isFav }) => (isFav ? "currentColor" : "none")};
    stroke: currentColor;
    stroke-width: 2;
  }
`;

const DetailsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 0.85rem;
`;

const MetaCard = styled.div`
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.cardBorder};
  border-radius: 10px;
  padding: 0.85rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const MetaLabel = styled.span`
  font-size: 0.725rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${theme.colors.textMuted};
`;

const MetaValue = styled.span`
  font-size: 0.95rem;
  font-weight: 700;
  color: ${theme.colors.textPrimary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const LyricsSection = styled.div`
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.cardBorder};
  border-radius: 10px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const LyricsTitle = styled.h3`
  margin: 0;
  font-size: 0.9rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${theme.colors.textMuted};
`;

const LyricsText = styled.p`
  margin: 0;
  white-space: pre-wrap;
  font-size: 0.9rem;
  line-height: 1.6;
  color: ${theme.colors.textSecondary};
  font-family: inherit;
`;

interface SongDetailsModalProps {
  song: Song | null;
  onClose: () => void;
  onEdit: (song: Song) => void;
  onDelete: (id: string) => void;
}

export const SongDetailsModal: React.FC<SongDetailsModalProps> = ({
  song,
  onClose,
  onEdit,
  onDelete,
}) => {
  const dispatch = useAppDispatch();
  const { currentSong, isPlaying, playlists } = useAppSelector((state) => state.songs);

  if (!song) return null;

  const isCurrent = currentSong?._id === song._id;
  const isCurrentlyPlaying = isCurrent && isPlaying;
  const coverUrl = getSongCover(song.title, song.genre, song.coverArt);

  const handlePlayToggle = () => {
    if (isCurrent) {
      dispatch(togglePlayPause());
    } else {
      dispatch(playSong(song));
    }
  };

  return (
    <Overlay onClick={onClose}>
      <ModalCard onClick={(e) => e.stopPropagation()}>
        <HeaderBanner bgCover={coverUrl}>
          <CloseBtn onClick={onClose}>&times;</CloseBtn>
          <HeroInfo>
            <CoverThumb src={coverUrl} alt={song.title} />
            <TitleMeta>
              <TrackTitle title={song.title}>{song.title}</TrackTitle>
              <ArtistSub title={song.artist}>{song.artist}</ArtistSub>
              <span style={{ fontSize: "0.8rem", color: theme.colors.textMuted }}>
                Album: {song.album}
              </span>
            </TitleMeta>
          </HeroInfo>
        </HeaderBanner>

        <ScrollContent>
          <ActionRow>
            <BigPlayButton isPlaying={isCurrentlyPlaying} onClick={handlePlayToggle}>
              {isCurrentlyPlaying ? (
                <>
                  <svg viewBox="0 0 24 24">
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                  </svg>
                  Pause
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Play Track
                </>
              )}
            </BigPlayButton>

            <HeartCircleBtn
              isFav={song.isFavorite}
              onClick={() => dispatch(toggleFavoriteStart(song._id))}
              title={song.isFavorite ? "Remove from Favorites" : "Add to Favorites"}
            >
              <svg viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </HeartCircleBtn>

            <select
              defaultValue=""
              onChange={(e) => {
                if (e.target.value) {
                  dispatch(addSongToPlaylist({ playlistId: e.target.value, songId: song._id }));
                  e.target.value = "";
                }
              }}
              style={{
                padding: "0.45rem 0.65rem",
                borderRadius: "8px",
                background: theme.colors.surface,
                border: `1px solid ${theme.colors.cardBorder}`,
                color: theme.colors.textPrimary,
                fontSize: "0.8rem",
                fontFamily: "inherit",
                cursor: "pointer",
              }}
            >
              <option value="" disabled>+ Add to Playlist...</option>
              {playlists.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>

            <div style={{ marginLeft: "auto", display: "flex", gap: "0.5rem" }}>
              <Button variant="outline" size="sm" onClick={() => { onClose(); onEdit(song); }}>
                Edit
              </Button>
              <Button variant="danger" size="sm" onClick={() => { onClose(); onDelete(song._id); }}>
                Delete
              </Button>
            </div>
          </ActionRow>

          <DetailsGrid>
            <MetaCard>
              <MetaLabel>Genre</MetaLabel>
              <MetaValue>{song.genre}</MetaValue>
            </MetaCard>

            <MetaCard>
              <MetaLabel>Duration</MetaLabel>
              <MetaValue>{song.duration || "N/A"}</MetaValue>
            </MetaCard>

            <MetaCard>
              <MetaLabel>Release Year</MetaLabel>
              <MetaValue>{song.releaseYear || "N/A"}</MetaValue>
            </MetaCard>

            <MetaCard>
              <MetaLabel>Added Date</MetaLabel>
              <MetaValue>{formatDate(song.createdAt)}</MetaValue>
            </MetaCard>
          </DetailsGrid>

          {song.lyrics ? (
            <LyricsSection>
              <LyricsTitle>Song Lyrics</LyricsTitle>
              <LyricsText>{song.lyrics}</LyricsText>
            </LyricsSection>
          ) : (
            <LyricsSection>
              <LyricsTitle>Song Lyrics</LyricsTitle>
              <LyricsText style={{ color: theme.colors.textMuted }}>No lyrics available for this track.</LyricsText>
            </LyricsSection>
          )}
        </ScrollContent>
      </ModalCard>
    </Overlay>
  );
};
