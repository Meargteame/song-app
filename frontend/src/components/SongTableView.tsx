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

const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
  background: ${theme.colors.cardBg};
  border: 1px solid ${theme.colors.cardBorder};
  border-radius: 12px;
  box-shadow: ${theme.shadows.card};
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.85rem;
`;

const Th = styled.th`
  padding: 0.85rem 1rem;
  color: ${theme.colors.textMuted};
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.725rem;
  letter-spacing: 0.05em;
  border-bottom: 1px solid ${theme.colors.cardBorder};
`;

const Tr = styled.tr<{ isCurrent?: boolean; isSelected?: boolean }>`
  border-bottom: 1px solid ${theme.colors.cardBorder};
  transition: background 0.15s ease;
  background: ${({ isSelected }) =>
    isSelected ? "var(--bg-surface-hover)" : "transparent"};

  &:hover {
    background: ${theme.colors.surfaceHover};
  }

  &:last-of-type {
    border-bottom: none;
  }
`;

const Td = styled.td`
  padding: 0.75rem 1rem;
  vertical-align: middle;
  color: ${theme.colors.textPrimary};
`;

const TrackInfoCell = styled.div`
  display: flex;
  align-items: center;
  gap: 0.85rem;
`;

const TrackThumb = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 6px;
  object-fit: cover;
  flex-shrink: 0;
`;

const TitleArtist = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const TrackTitle = styled.span<{ isCurrent?: boolean }>`
  font-weight: 600;
  color: ${({ isCurrent }) =>
    isCurrent ? "var(--music-accent)" : theme.colors.textPrimary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const TrackArtist = styled.span`
  font-size: 0.775rem;
  color: ${theme.colors.textSecondary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const PlayIconBtn = styled.button<{ isPlaying?: boolean }>`
  background: transparent;
  border: none;
  color: ${({ isPlaying }) =>
    isPlaying ? "var(--music-accent)" : theme.colors.textMuted};
  cursor: pointer;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;

  &:hover {
    color: var(--music-accent);
    transform: scale(1.15);
  }

  svg {
    width: 16px;
    height: 16px;
    fill: currentColor;
  }
`;

const HeartBtn = styled.button<{ isFav?: boolean }>`
  background: transparent;
  border: none;
  color: ${({ isFav }) => (isFav ? "#f43f5e" : theme.colors.textMuted)};
  cursor: pointer;
  padding: 0.25rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.15s ease;

  &:hover {
    color: #f43f5e;
    transform: scale(1.15);
  }

  svg {
    width: 16px;
    height: 16px;
    fill: ${({ isFav }) => (isFav ? "currentColor" : "none")};
    stroke: currentColor;
    stroke-width: 2;
  }
`;

const GenrePill = styled.span`
  font-size: 0.725rem;
  font-weight: 500;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  background: ${theme.colors.tagBg};
  color: ${theme.colors.tagText};
  border: 1px solid ${theme.colors.tagBorder};
`;

const ActionBtn = styled.button<{ danger?: boolean }>`
  background: transparent;
  border: none;
  color: ${({ danger }) => (danger ? theme.colors.danger : theme.colors.textSecondary)};
  cursor: pointer;
  padding: 0.3rem 0.4rem;
  border-radius: 4px;

  &:hover {
    color: ${({ danger }) => (danger ? "#ffffff" : theme.colors.textPrimary)};
    background: ${({ danger }) => (danger ? theme.colors.danger : theme.colors.surfaceHover)};
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

interface SongTableViewProps {
  songs: Song[];
  onEdit: (song: Song) => void;
  onDelete: (id: string) => void;
}

export const SongTableView: React.FC<SongTableViewProps> = ({ songs, onEdit, onDelete }) => {
  const dispatch = useAppDispatch();
  const { currentSong, isPlaying, selectedSongIds } = useAppSelector((state) => state.songs);

  return (
    <TableContainer>
      <Table>
        <thead>
          <Tr>
            <Th style={{ width: "40px" }}></Th>
            <Th style={{ width: "40px" }}></Th>
            <Th>Title & Artist</Th>
            <Th>Album</Th>
            <Th>Genre</Th>
            <Th style={{ width: "70px" }}>Duration</Th>
            <Th style={{ width: "50px" }}></Th>
            <Th style={{ width: "100px", textAlign: "right" }}>Actions</Th>
          </Tr>
        </thead>
        <tbody>
          {songs.map((song) => {
            const isCurrent = currentSong?._id === song._id;
            const isCurrentlyPlaying = isCurrent && isPlaying;
            const isSelected = selectedSongIds.includes(song._id);
            const coverUrl = getSongCover(song.title, song.genre, song.coverArt);

            return (
              <Tr key={song._id} isCurrent={isCurrent} isSelected={isSelected}>
                <Td>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => dispatch(toggleSelectSong(song._id))}
                    style={{ accentColor: "var(--music-accent)", cursor: "pointer" }}
                  />
                </Td>

                <Td>
                  <PlayIconBtn
                    isPlaying={isCurrentlyPlaying}
                    onClick={() => {
                      if (isCurrent) dispatch(togglePlayPause());
                      else dispatch(playSong(song));
                    }}
                    title={isCurrentlyPlaying ? "Pause" : "Play"}
                  >
                    {isCurrentlyPlaying ? (
                      <svg viewBox="0 0 24 24">
                        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    )}
                  </PlayIconBtn>
                </Td>

                <Td>
                  <TrackInfoCell>
                    <TrackThumb src={coverUrl} alt={song.title} />
                    <TitleArtist>
                      <TrackTitle isCurrent={isCurrent}>{song.title}</TrackTitle>
                      <TrackArtist>{song.artist}</TrackArtist>
                    </TitleArtist>
                  </TrackInfoCell>
                </Td>

                <Td style={{ color: theme.colors.textSecondary }}>{song.album}</Td>

                <Td>
                  <GenrePill>{song.genre}</GenrePill>
                </Td>

                <Td style={{ color: theme.colors.textMuted, fontVariantNumeric: "tabular-nums" }}>
                  {song.duration || "--:--"}
                </Td>

                <Td>
                  <HeartBtn
                    isFav={song.isFavorite}
                    onClick={() => dispatch(toggleFavoriteStart(song._id))}
                    title={song.isFavorite ? "Remove favorite" : "Add favorite"}
                  >
                    <svg viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                  </HeartBtn>
                </Td>

                <Td style={{ textAlign: "right" }}>
                  <div style={{ display: "inline-flex", gap: "0.25rem" }}>
                    {song.lyrics && (
                      <ActionBtn onClick={() => dispatch(setActiveLyricsSong(song))} title="Lyrics">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                          <polyline points="14 2 14 8 20 8"></polyline>
                        </svg>
                      </ActionBtn>
                    )}
                    <ActionBtn onClick={() => onEdit(song)} title="Edit">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                    </ActionBtn>
                    <ActionBtn danger onClick={() => onDelete(song._id)} title="Delete">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </ActionBtn>
                  </div>
                </Td>
              </Tr>
            );
          })}
        </tbody>
      </Table>
    </TableContainer>
  );
};
