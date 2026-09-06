import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import {
  fetchSongsStart,
  fetchStatsStart,
  createSongStart,
  updateSongStart,
  deleteSongStart,
  batchDeleteStart,
  selectAllSongs,
  clearSelectedSongs,
  setActiveTab,
  clearNotification,
  playSong,
} from "./store/slices/songSlice";
import { Song, CreateSongDTO } from "./types";
import { theme, Button } from "./styles";
import { useSongFilters, SortOption } from "./hooks/useSongFilters";
import { Sidebar } from "./components/Sidebar";
import { HomePage } from "./components/HomePage";
import { PlaylistsPage } from "./components/PlaylistsPage";
import { StatsDashboard } from "./components/StatsDashboard";
import { SongCard } from "./components/SongCard";
import { SongTableView } from "./components/SongTableView";
import { SongModal } from "./components/SongModal";
import { SongDetailsModal } from "./components/SongDetailsModal";
import { AudioPlayerBar } from "./components/AudioPlayerBar";
import { LyricsDrawer } from "./components/LyricsDrawer";
import { SkeletonGrid } from "./components/SkeletonCard";
import { ConfirmModal } from "./components/ConfirmModal";

/* ——— Animations ——— */
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
`;

const toastSlide = keyframes`
  from { opacity: 0; transform: translateX(20px); }
  to { opacity: 1; transform: translateX(0); }
`;

/* ——— Layout ——— */
const LayoutWrapper = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: ${theme.colors.background};
`;

const MainCanvas = styled.main`
  flex: 1;
  margin-left: 240px;
  padding: 2rem 2.5rem 110px 2.5rem;
  box-sizing: border-box;
  min-height: 100vh;
  overflow-x: hidden;

  @media (max-width: 768px) {
    margin-left: 70px;
    padding: 1.5rem 1rem 110px 1rem;
  }

  @media (max-width: 640px) {
    margin-left: 0;
    padding: 1rem 0.85rem 150px 0.85rem;
  }
`;

/* ——— Page Container (animated swap) ——— */
const PageContent = styled.div`
  animation: ${fadeIn} 0.25s ease-out;
`;

/* ——— Tabs ——— */
const TabsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid ${theme.colors.cardBorder};
  padding-bottom: 0.75rem;

  @media (max-width: 480px) {
    flex-wrap: wrap;
  }
`;

const TabButton = styled.button<{ active: boolean }>`
  background: ${({ active }) => (active ? "var(--tab-active-bg)" : "transparent")};
  color: ${({ active }) => (active ? theme.colors.textPrimary : theme.colors.textMuted)};
  border: 1px solid ${({ active }) => (active ? "var(--tab-active-border)" : "transparent")};
  padding: 0.45rem 0.95rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-family: inherit;

  &:hover {
    color: ${theme.colors.textPrimary};
    background: var(--tab-active-bg);
  }
`;

/* ——— Batch Bar ——— */
const BatchBar = styled.div`
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.cardBorderHover};
  border-radius: 8px;
  padding: 0.75rem 1.25rem;
  margin-bottom: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.75rem;
  animation: ${fadeIn} 0.2s ease-out;
`;

const BatchMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${theme.colors.textPrimary};
  flex-wrap: wrap;
`;

const BatchActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

/* ——— Controls ——— */
const ControlsBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const ControlsLeft = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
  min-width: 0;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const SearchInputWrapper = styled.div`
  position: relative;
  flex: 1;
  min-width: 200px;
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
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: ${theme.colors.cardBorderHover};
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
  pointer-events: none;
  display: flex;
  align-items: center;

  svg {
    width: 14px;
    height: 14px;
  }
`;

const SelectControl = styled.select`
  padding: 0.55rem 0.85rem;
  border-radius: 6px;
  background: ${theme.colors.surface};
  color: ${theme.colors.textPrimary};
  border: 1px solid ${theme.colors.cardBorder};
  cursor: pointer;
  font-size: 0.825rem;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: ${theme.colors.cardBorderHover};
  }

  @media (max-width: 640px) {
    width: 100%;
  }
`;

/* ——— Hero Music Banner ——— */
const HeroBanner = styled.div`
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(20, 20, 25, 0.8) 100%);
  border: 1px solid ${theme.colors.cardBorder};
  border-radius: 16px;
  padding: 1.75rem 2rem;
  margin-bottom: 1.75rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.25rem;
  box-shadow: ${theme.shadows.card};

  @media (max-width: 640px) {
    padding: 1.25rem 1rem;
  }
`;

const HeroMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const HeroTitle = styled.h2`
  font-size: 1.6rem;
  font-weight: 800;
  margin: 0;
  color: ${theme.colors.textPrimary};
  letter-spacing: -0.03em;
  display: flex;
  align-items: center;
  gap: 0.6rem;
`;

const HeroSubtitle = styled.p`
  margin: 0;
  font-size: 0.875rem;
  color: ${theme.colors.textSecondary};
`;

const ViewToggleGroup = styled.div`
  display: inline-flex;
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.cardBorder};
  border-radius: 8px;
  padding: 3px;
  gap: 2px;
`;

const ViewToggleBtn = styled.button<{ active: boolean }>`
  background: ${({ active }) => (active ? "var(--music-accent)" : "transparent")};
  color: ${({ active }) => (active ? "#ffffff" : theme.colors.textMuted)};
  border: none;
  border-radius: 6px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    color: ${({ active }) => (active ? "#ffffff" : theme.colors.textPrimary)};
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

/* ——— Section Header ——— */
const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 0.5rem;
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

/* ——— Grid ——— */
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.15rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const AnimatedCardWrapper = styled.div<{ index: number }>`
  animation: ${fadeIn} 0.3s ease-out both;
  animation-delay: ${({ index }) => Math.min(index * 0.04, 0.4)}s;
`;

/* ——— Toast ——— */
const Toast = styled.div<{ type: "success" | "error" }>`
  position: fixed;
  bottom: 5.5rem;
  right: 1.5rem;
  background: ${theme.colors.cardBg};
  border: 1px solid
    ${({ type }) =>
    type === "success" ? "rgba(34, 197, 94, 0.4)" : "rgba(239, 68, 68, 0.4)"};
  color: ${({ type }) =>
    type === "success" ? "#16a34a" : "#dc2626"};
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  box-shadow: ${theme.shadows.popover};
  z-index: 2000;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  animation: ${toastSlide} 0.25s ease-out;

  @media (max-width: 640px) {
    right: 1rem;
    left: 1rem;
    bottom: 5rem;
  }
`;

/* ——— Empty State ——— */
const EmptyState = styled.div`
  text-align: center;
  padding: 3.5rem 2rem;
  background: ${theme.colors.cardBg};
  border: 1px solid ${theme.colors.cardBorder};
  border-radius: 10px;
  margin-top: 1rem;
  animation: ${fadeIn} 0.3s ease-out;
`;

/* ========== APP COMPONENT ========== */

export const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    songs,
    loading,
    error,
    successMessage,
    statistics,
    activeTab,
    selectedSongIds,
    themeMode,
    currentPage,
  } = useAppSelector((state) => state.songs);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSong, setEditingSong] = useState<Song | null>(null);
  const [detailsSong, setDetailsSong] = useState<Song | null>(null);

  // Confirm Modal State
  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({ isOpen: false, title: "", message: "", onConfirm: () => { } });

  // Sync document theme
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", themeMode);
  }, [themeMode]);

  // Custom filter & sort hook
  const {
    searchQuery,
    setSearchQuery,
    selectedGenre,
    setSelectedGenre,
    sortBy,
    setSortBy,
    filteredSongs,
    favoritesCount,
  } = useSongFilters({ songs, activeTab });

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
      dispatch(updateSongStart({ id: editingSong._id, data: formData }));
    } else {
      dispatch(createSongStart(formData));
    }
  };

  const handleDelete = (id: string) => {
    const song = songs.find((s) => s._id === id);
    setConfirmState({
      isOpen: true,
      title: "Delete Song",
      message: `Are you sure you want to delete "${song?.title || "this song"}"? This action cannot be undone.`,
      onConfirm: () => {
        dispatch(deleteSongStart(id));
        setConfirmState((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const handleBatchDelete = () => {
    setConfirmState({
      isOpen: true,
      title: "Delete Selected Songs",
      message: `Are you sure you want to delete ${selectedSongIds.length} selected song(s)? This action cannot be undone.`,
      onConfirm: () => {
        dispatch(batchDeleteStart(selectedSongIds));
        setConfirmState((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const handleSelectAllVisible = () => {
    dispatch(selectAllSongs(filteredSongs.map((s) => s._id)));
  };

  const [viewLayout, setViewLayout] = useState<"grid" | "list">("grid");

  /* ——— Render Songs Page ——— */
  const renderSongsPage = () => (
    <PageContent key="songs">
      {/* Hero Banner */}
      <HeroBanner>
        <HeroMeta>
          <HeroTitle>
            Your Music Library
          </HeroTitle>
          <HeroSubtitle>
            Manage, stream, and analyze your personal track collection
          </HeroSubtitle>
        </HeroMeta>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {filteredSongs.length > 0 && (
            <Button
              variant="primary"
              onClick={() => dispatch(playSong(filteredSongs[0]))}
              style={{ padding: "0.55rem 1.25rem", borderRadius: "8px", fontWeight: 600 }}
            >
              <svg viewBox="0 0 24 24" style={{ width: "16px", height: "16px", fill: "currentColor" }}>
                <path d="M8 5v14l11-7z" />
              </svg>
              Play Library
            </Button>
          )}
          <Button
            variant="secondary"
            onClick={handleOpenAdd}
            style={{ padding: "0.55rem 1.15rem", borderRadius: "8px" }}
          >
            + Add Track
          </Button>
        </div>
      </HeroBanner>

      {/* Tabs Row & Layout Switcher */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem", flexWrap: "wrap", gap: "0.75rem" }}>
        <TabsRow style={{ margin: 0, padding: 0, border: "none" }}>
          <TabButton
            active={activeTab === "all"}
            onClick={() => dispatch(setActiveTab("all"))}
          >
            All Songs ({songs.length})
          </TabButton>
          <TabButton
            active={activeTab === "favorites"}
            onClick={() => dispatch(setActiveTab("favorites"))}
          >
            Favorites ({favoritesCount})
          </TabButton>
        </TabsRow>

        <ViewToggleGroup>
          <ViewToggleBtn
            active={viewLayout === "grid"}
            onClick={() => setViewLayout("grid")}
            title="Grid View (Album Cover Cards)"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M4 4h4v4H4V4zm6 0h4v4h-4V4zm6 0h4v4h-4V4zM4 10h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4zM4 16h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4z" />
            </svg>
          </ViewToggleBtn>
          <ViewToggleBtn
            active={viewLayout === "list"}
            onClick={() => setViewLayout("list")}
            title="List View (Spotify Tracklist Table)"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M4 6h16v2H4V6zm0 5h16v2H4v-2zm0 5h16v2H4v-2z" />
            </svg>
          </ViewToggleBtn>
        </ViewToggleGroup>
      </div>

      {/* Batch Operations */}
      {selectedSongIds.length > 0 && (
        <BatchBar>
          <BatchMeta>
            <span>{selectedSongIds.length} song(s) selected</span>
            <Button variant="outline" size="sm" onClick={handleSelectAllVisible}>
              Select All Visible ({filteredSongs.length})
            </Button>
            <Button variant="outline" size="sm" onClick={() => dispatch(clearSelectedSongs())}>
              Clear Selection
            </Button>
          </BatchMeta>
          <BatchActions>
            <Button variant="danger" size="sm" onClick={handleBatchDelete}>
              Delete Selected ({selectedSongIds.length})
            </Button>
          </BatchActions>
        </BatchBar>
      )}

      {/* Search, Genre, Sort Controls */}
      <ControlsBar>
        <ControlsLeft>
          <SearchInputWrapper>
            <SearchIcon>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </SearchIcon>
            <SearchInput
              placeholder="Search by title, artist, album..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SearchInputWrapper>

          <SelectControl
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
          >
            <option value="">All Genres</option>
            {(statistics?.songsPerGenre || []).map((g) => (
              <option key={g._id || "unknown"} value={g._id}>
                {g._id || "Unknown"}
              </option>
            ))}
          </SelectControl>

          <SelectControl
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="title">Title A–Z</option>
            <option value="artist">Artist A–Z</option>
            <option value="genre">Genre A–Z</option>
          </SelectControl>
        </ControlsLeft>
      </ControlsBar>

      {/* Section Header */}
      <SectionHeader>
        <SectionTitle>
          {activeTab === "favorites" ? "Favorite Tracks" : "Catalog"}
          <CountBadge>{filteredSongs.length} songs</CountBadge>
        </SectionTitle>
      </SectionHeader>

      {/* Content: Skeleton / Empty / Grid / List */}
      {loading && songs.length === 0 ? (
        <Grid>
          <SkeletonGrid count={6} />
        </Grid>
      ) : filteredSongs.length === 0 ? (
        <EmptyState>
          <h3 style={{ margin: "0 0 0.5rem 0", color: theme.colors.textPrimary, fontSize: "1.1rem" }}>
            {activeTab === "favorites" ? "No Favorites Yet" : "No Songs Found"}
          </h3>
          <p style={{ color: theme.colors.textMuted, margin: "0 0 1.25rem 0", fontSize: "0.875rem" }}>
            {activeTab === "favorites"
              ? "Click the heart icon on any song card to add it to your favorites."
              : searchQuery
                ? `No songs matching "${searchQuery}".`
                : "The song catalog is currently empty."}
          </p>
          {activeTab === "all" && (
            <Button variant="primary" onClick={handleOpenAdd}>
              + Add Song
            </Button>
          )}
        </EmptyState>
      ) : viewLayout === "list" ? (
        <SongTableView
          songs={filteredSongs}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          onViewDetails={(song) => setDetailsSong(song)}
        />
      ) : (
        <Grid>
          {filteredSongs.map((song, index) => (
            <AnimatedCardWrapper key={song._id} index={index}>
              <SongCard
                song={song}
                onEdit={handleOpenEdit}
                onDelete={handleDelete}
                onViewDetails={(song) => setDetailsSong(song)}
              />
            </AnimatedCardWrapper>
          ))}
        </Grid>
      )}
    </PageContent>
  );

  /* ——— Render Analytics Page ——— */
  const renderAnalyticsPage = () => (
    <PageContent key="analytics">
      <StatsDashboard />
    </PageContent>
  );

  return (
    <LayoutWrapper>
      <Sidebar onOpenAddModal={handleOpenAdd} />

      <MainCanvas>
        {/* Page Router */}
        {currentPage === "home" ? (
          <PageContent key="home">
            <HomePage
              onEdit={handleOpenEdit}
              onDelete={handleDelete}
              onViewDetails={(s) => setDetailsSong(s)}
            />
          </PageContent>
        ) : currentPage === "playlists" ? (
          <PageContent key="playlists">
            <PlaylistsPage
              onEdit={handleOpenEdit}
              onDelete={handleDelete}
              onViewDetails={(s) => setDetailsSong(s)}
            />
          </PageContent>
        ) : currentPage === "songs" ? (
          renderSongsPage()
        ) : (
          renderAnalyticsPage()
        )}

        {/* Modals */}
        <SongModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleModalSubmit}
          initialData={editingSong}
        />

        <SongDetailsModal
          song={detailsSong}
          onClose={() => setDetailsSong(null)}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
        />

        <ConfirmModal
          isOpen={confirmState.isOpen}
          title={confirmState.title}
          message={confirmState.message}
          confirmLabel="Delete"
          onConfirm={confirmState.onConfirm}
          onCancel={() => setConfirmState((prev) => ({ ...prev, isOpen: false }))}
        />

        <LyricsDrawer />
        <AudioPlayerBar />

        {successMessage && <Toast type="success">{successMessage}</Toast>}
        {error && <Toast type="error">{error}</Toast>}
      </MainCanvas>
    </LayoutWrapper>
  );
};