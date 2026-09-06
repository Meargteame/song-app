import React, { useEffect, useState, useMemo } from "react";
import styled from "@emotion/styled";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import {
  fetchSongsStart,
  fetchStatsStart,
  createSongStart,
  updateSongStart,
  deleteSongStart,
  clearNotification,
} from "./store/slices/songSlice";
import { Song, CreateSongDTO } from "./types";
import { Container, theme, Button } from "./styles";
import { Navbar } from "./components/Navbar";
import { StatsDashboard } from "./components/StatsDashboard";
import { SongCard } from "./components/SongCard";
import { SongModal } from "./components/SongModal";

const AppWrapper = styled.div`
  min-height: 100vh;
  background-color: ${theme.colors.background};
`;

const ControlsBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
`;

const ControlsLeft = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
  min-width: 280px;
`;

const SearchInputWrapper = styled.div`
  position: relative;
  flex: 1;
  min-width: 220px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.55rem 0.85rem 0.55rem 2.2rem;
  border-radius: 6px;
  background: ${theme.colors.surface};
  color: ${theme.colors.textPrimary};
  border: 1px solid ${theme.colors.cardBorder};
  box-sizing: border-box;
  font-size: 0.875rem;

  &:focus {
    outline: none;
    border-color: #52525b;
  }

  &::placeholder {
    color: ${theme.colors.textMuted};
  }
`;

const SearchIcon = styled.span`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${theme.colors.textMuted};
  font-size: 0.85rem;
  pointer-events: none;
`;

const GenreSelect = styled.select`
  padding: 0.55rem 0.85rem;
  border-radius: 6px;
  background: ${theme.colors.surface};
  color: ${theme.colors.textPrimary};
  border: 1px solid ${theme.colors.cardBorder};
  cursor: pointer;
  font-size: 0.875rem;

  &:focus {
    outline: none;
    border-color: #52525b;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
  color: ${theme.colors.textPrimary};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CountBadge = styled.span`
  font-size: 0.75rem;
  background: ${theme.colors.tagBg};
  color: ${theme.colors.textSecondary};
  border: 1px solid ${theme.colors.tagBorder};
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
  font-weight: 500;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
`;

const Toast = styled.div<{ type: "success" | "error" }>`
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  background: ${({ type }) =>
    type === "success" ? "#18181b" : "#18181b"};
  border: 1px solid
    ${({ type }) =>
      type === "success" ? "rgba(34, 197, 94, 0.4)" : "rgba(239, 68, 68, 0.4)"};
  color: ${({ type }) =>
    type === "success" ? "#4ade80" : "#f87171"};
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  box-shadow: ${theme.shadows.popover};
  z-index: 2000;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3.5rem 2rem;
  background: ${theme.colors.cardBg};
  border: 1px solid ${theme.colors.cardBorder};
  border-radius: 10px;
  margin-top: 1rem;
`;

export const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const { songs, loading, error, successMessage, statistics } = useAppSelector(
    (state) => state.songs
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSong, setEditingSong] = useState<Song | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    dispatch(fetchSongsStart(selectedGenre || undefined));
    dispatch(fetchStatsStart());
  }, [dispatch, selectedGenre]);

  useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(() => {
        dispatch(clearNotification());
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, error, dispatch]);

  const handleOpenAdd = () => {
    setEditingSong(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (song: Song) => {
    setEditingSong(song);
    setIsModalOpen(true);
  };

  const handleModalSubmit = (formData: CreateSongDTO) => {
    if (editingSong) {
      dispatch(
        updateSongStart({ id: editingSong._id, data: formData })
      );
    } else {
      dispatch(createSongStart(formData));
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this song?")) {
      dispatch(deleteSongStart(id));
    }
  };

  const filteredSongs = useMemo(() => {
    if (!searchQuery.trim()) return songs;
    const query = searchQuery.toLowerCase();
    return songs.filter(
      (s) =>
        s.title.toLowerCase().includes(query) ||
        s.artist.toLowerCase().includes(query) ||
        s.album.toLowerCase().includes(query) ||
        s.genre.toLowerCase().includes(query)
    );
  }, [songs, searchQuery]);

  return (
    <AppWrapper>
      <Container>
        <Navbar onOpenAddModal={handleOpenAdd} />

        <StatsDashboard />

        <ControlsBar>
          <ControlsLeft>
            <SearchInputWrapper>
              <SearchIcon>⌕</SearchIcon>
              <SearchInput
                placeholder="Search by title, artist, album, genre..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </SearchInputWrapper>

            <GenreSelect
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
            >
              <option value="">All Genres</option>
              {(statistics?.songsPerGenre || []).map((g) => (
                <option key={g._id || "unknown"} value={g._id}>
                  {g._id || "Unknown"}
                </option>
              ))}
            </GenreSelect>
          </ControlsLeft>

          <Button variant="primary" size="md" onClick={handleOpenAdd}>
            + Add Song
          </Button>
        </ControlsBar>

        <SectionHeader>
          <SectionTitle>
            Catalog
            <CountBadge>{filteredSongs.length} songs</CountBadge>
          </SectionTitle>
        </SectionHeader>

        {loading && songs.length === 0 ? (
          <p style={{ color: theme.colors.textMuted, fontSize: "0.9rem" }}>Loading songs...</p>
        ) : filteredSongs.length === 0 ? (
          <EmptyState>
            <h3 style={{ margin: "0 0 0.5rem 0", color: theme.colors.textPrimary, fontSize: "1.1rem" }}>
              No Songs Found
            </h3>
            <p style={{ color: theme.colors.textMuted, margin: "0 0 1.25rem 0", fontSize: "0.875rem" }}>
              {searchQuery
                ? `No songs matching "${searchQuery}".`
                : "The song catalog is currently empty."}
            </p>
            <Button variant="primary" onClick={handleOpenAdd}>
              + Add Song
            </Button>
          </EmptyState>
        ) : (
          <Grid>
            {filteredSongs.map((song) => (
              <SongCard
                key={song._id}
                song={song}
                onEdit={handleOpenEdit}
                onDelete={handleDelete}
              />
            ))}
          </Grid>
        )}

        <SongModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleModalSubmit}
          initialData={editingSong}
        />

        {successMessage && <Toast type="success">✓ {successMessage}</Toast>}
        {error && <Toast type="error">✕ {error}</Toast>}
      </Container>
    </AppWrapper>
  );
};