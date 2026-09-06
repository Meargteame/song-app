import React, { useState } from "react";
import styled from "@emotion/styled";
import { theme, Button } from "../styles";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { createPlaylist, deletePlaylist, removeSongFromPlaylist, playSong } from "../store/slices/songSlice";
import { Song } from "../types";
import { SongCard } from "./SongCard";

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
`;

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
`;

const PageTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 800;
  margin: 0;
  color: ${theme.colors.textPrimary};
  letter-spacing: -0.03em;
`;

const CreateForm = styled.form`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  input {
    padding: 0.55rem 0.85rem;
    border-radius: 8px;
    background: ${theme.colors.surface};
    border: 1px solid ${theme.colors.cardBorder};
    color: ${theme.colors.textPrimary};
    font-size: 0.875rem;
    font-family: inherit;

    &:focus {
      outline: none;
      border-color: var(--music-accent);
    }
  }
`;

const PlaylistGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.25rem;
`;

const PlaylistCard = styled.div<{ active: boolean }>`
  background: ${theme.colors.cardBg};
  border: 1px solid
    ${({ active }) => (active ? "var(--music-accent)" : theme.colors.cardBorder)};
  border-radius: 12px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  cursor: pointer;
  box-shadow: ${theme.shadows.card};
  transition: all 0.2s ease;

  &:hover {
    border-color: ${theme.colors.cardBorderHover};
    transform: translateY(-2px);
  }
`;

const PlaylistHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PlaylistName = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
  color: ${theme.colors.textPrimary};
`;

const SongCount = styled.span`
  font-size: 0.8rem;
  color: ${theme.colors.textMuted};
`;

const PlaylistTracksSection = styled.div`
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

interface PlaylistsPageProps {
  onEdit: (song: Song) => void;
  onDelete: (id: string) => void;
  onViewDetails: (song: Song) => void;
}

export const PlaylistsPage: React.FC<PlaylistsPageProps> = ({ onEdit, onDelete, onViewDetails }) => {
  const dispatch = useAppDispatch();
  const { playlists, songs } = useAppSelector((state) => state.songs);
  const [newPlName, setNewPlName] = useState("");
  const [selectedPlId, setSelectedPlId] = useState<string>(playlists[0]?.id || "");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlName.trim()) return;
    dispatch(createPlaylist(newPlName));
    setNewPlName("");
  };

  const currentPlaylist = playlists.find((p) => p.id === selectedPlId);
  const playlistSongs = songs.filter((s) => currentPlaylist?.songIds.includes(s._id));

  return (
    <PageWrapper>
      <TopRow>
        <PageTitle>User Playlists</PageTitle>
        <CreateForm onSubmit={handleCreate}>
          <input
            placeholder="New playlist name..."
            value={newPlName}
            onChange={(e) => setNewPlName(e.target.value)}
          />
          <Button type="submit" variant="primary" style={{ borderRadius: "8px" }}>
            + Create
          </Button>
        </CreateForm>
      </TopRow>

      <PlaylistGrid>
        {playlists.map((pl) => (
          <PlaylistCard
            key={pl.id}
            active={pl.id === selectedPlId}
            onClick={() => setSelectedPlId(pl.id)}
          >
            <PlaylistHeader>
              <PlaylistName>{pl.name}</PlaylistName>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch(deletePlaylist(pl.id));
                }}
                title="Delete Playlist"
                style={{ padding: "0.2rem 0.5rem" }}
              >
                &times;
              </Button>
            </PlaylistHeader>
            <SongCount>{pl.songIds.length} tracks</SongCount>
          </PlaylistCard>
        ))}
      </PlaylistGrid>

      {currentPlaylist && (
        <PlaylistTracksSection>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ fontSize: "1.3rem", margin: 0, color: theme.colors.textPrimary }}>
              Playlist: {currentPlaylist.name} ({playlistSongs.length})
            </h2>
            {playlistSongs.length > 0 && (
              <Button
                variant="primary"
                onClick={() => dispatch(playSong(playlistSongs[0]))}
                style={{ borderRadius: "20px" }}
              >
                ▶ Play Playlist
              </Button>
            )}
          </div>

          {playlistSongs.length === 0 ? (
            <div style={{ background: theme.colors.cardBg, border: `1px dashed ${theme.colors.cardBorder}`, borderRadius: "12px", padding: "2.5rem", textAlign: "center", color: theme.colors.textMuted }}>
              No tracks in this playlist yet. Add tracks using the details modal or song cards!
            </div>
          ) : (
            <PlaylistGrid>
              {playlistSongs.map((song) => (
                <div key={song._id} style={{ position: "relative" }}>
                  <SongCard
                    song={song}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onViewDetails={onViewDetails}
                  />
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => dispatch(removeSongFromPlaylist({ playlistId: currentPlaylist.id, songId: song._id }))}
                    style={{ marginTop: "0.5rem", width: "100%" }}
                  >
                    Remove from Playlist
                  </Button>
                </div>
              ))}
            </PlaylistGrid>
          )}
        </PlaylistTracksSection>
      )}
    </PageWrapper>
  );
};
