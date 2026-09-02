import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import {
  fetchSongsStart,
  fetchStatsStart,
  createSongStart,
  updateSongStart,
  deleteSongStart,
} from "./store/slices/songSlice";
import { Song, CreateSongDTO } from "./types";
import { Container, theme } from "./styles";
import { Navbar } from "./components/Navbar";
import { StatsDashboard } from "./components/StatsDashboard";
import { SongCard } from "./components/SongCard";
import { SongModal } from "./components/SongModal";

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
`;

const FilterRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const GenreSelect = styled.select`
  padding: 0.5rem 1rem;
  border-radius: 8px;
  background: ${theme.colors.cardBg};
  color: ${theme.colors.textPrimary};
  border: 1px solid ${theme.colors.cardBorder};
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
  }
`;

const ErrorBanner = styled.div`
  background: rgba(239, 68, 68, 0.2);
  border: 1px solid ${theme.colors.danger};
  color: #fca5a5;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
`;

export const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const { songs, loading, error, statistics } = useAppSelector(
    (state) => state.songs
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSong, setEditingSong] = useState<Song | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<string>("");

  // Fetch initial songs and statistics when app launches
  useEffect(() => {
    dispatch(fetchSongsStart(selectedGenre || undefined));
    dispatch(fetchStatsStart());
  }, [dispatch, selectedGenre]);

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
    // Refresh stats after modifying
    setTimeout(() => dispatch(fetchStatsStart()), 500);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this song?")) {
      dispatch(deleteSongStart(id));
      setTimeout(() => dispatch(fetchStatsStart()), 500);
    }
  };

  return (
    <Container>
      <Navbar onOpenAddModal={handleOpenAdd} />

      {error && <ErrorBanner>{error}</ErrorBanner>}

      <StatsDashboard />

      <FilterRow>
        <h2>Song Catalog ({songs.length})</h2>
        <GenreSelect
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
        >
          <option value="">All Genres</option>
          {statistics?.songsPerGenre.map((g) => (
            <option key={g._id} value={g._id}>
              {g._id || "Unknown"}
            </option>
          ))}
        </GenreSelect>
      </FilterRow>

      {loading && songs.length === 0 ? (
        <p>Loading songs...</p>
      ) : (
        <Grid>
          {songs.map((song) => (
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
    </Container>
  );
};