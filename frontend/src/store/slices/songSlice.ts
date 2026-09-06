import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Song, Statistics, CreateSongDTO, UpdateSongDTO } from "../../types";

export interface SongState {
  songs: Song[];
  statistics: Statistics | null;
  loading: boolean;
  actionLoading: boolean;
  error: string | null;
  successMessage: string | null;
  
  // Navigation & View
  activeTab: "all" | "favorites";
  viewMode: "cards" | "analytics";
  
  // Selection for batch actions
  selectedSongIds: string[];

  // Audio Player State
  currentSong: Song | null;
  isPlaying: boolean;
  volume: number;

  // Active Lyrics Modal
  activeLyricsSong: Song | null;
  isExportImportOpen: boolean;
}

const initialState: SongState = {
  songs: [],
  statistics: null,
  loading: false,
  actionLoading: false,
  error: null,
  successMessage: null,
  activeTab: "all",
  viewMode: "cards",
  selectedSongIds: [],
  currentSong: null,
  isPlaying: false,
  volume: 0.8,
  activeLyricsSong: null,
  isExportImportOpen: false,
};

const songSlice = createSlice({
  name: "songs",
  initialState,
  reducers: {
    // 1. Fetch songs
    fetchSongsStart(state, _action: PayloadAction<string | undefined>) {
      state.loading = true;
      state.error = null;
    },
    fetchSongsSuccess(state, action: PayloadAction<Song[]>) {
      state.songs = Array.isArray(action.payload) ? action.payload : [];
      state.loading = false;
    },
    fetchSongsFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },

    // 2. Create song
    createSongStart(state, _action: PayloadAction<CreateSongDTO>) {
      state.actionLoading = true;
      state.error = null;
      state.successMessage = null;
    },
    createSongSuccess(state, action: PayloadAction<Song>) {
      state.songs.unshift(action.payload);
      state.actionLoading = false;
      state.successMessage = "Song created successfully!";
    },
    createSongFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.actionLoading = false;
    },

    // 3. Update song
    updateSongStart(
      state,
      _action: PayloadAction<{ id: string; data: UpdateSongDTO }>
    ) {
      state.actionLoading = true;
      state.error = null;
      state.successMessage = null;
    },
    updateSongSuccess(state, action: PayloadAction<Song>) {
      const index = state.songs.findIndex((s) => s._id === action.payload._id);
      if (index !== -1) {
        state.songs[index] = action.payload;
      }
      if (state.currentSong?._id === action.payload._id) {
        state.currentSong = action.payload;
      }
      state.actionLoading = false;
      state.successMessage = "Song updated successfully!";
    },
    updateSongFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.actionLoading = false;
    },

    // 4. Delete song
    deleteSongStart(state, _action: PayloadAction<string>) {
      state.actionLoading = true;
      state.error = null;
      state.successMessage = null;
    },
    deleteSongSuccess(state, action: PayloadAction<string>) {
      state.songs = state.songs.filter((s) => s._id !== action.payload);
      state.selectedSongIds = state.selectedSongIds.filter((id) => id !== action.payload);
      if (state.currentSong?._id === action.payload) {
        state.currentSong = null;
        state.isPlaying = false;
      }
      state.actionLoading = false;
      state.successMessage = "Song deleted successfully!";
    },
    deleteSongFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.actionLoading = false;
    },

    // 4.1. Batch Delete
    batchDeleteStart(state, _action: PayloadAction<string[]>) {
      state.actionLoading = true;
      state.error = null;
      state.successMessage = null;
    },
    batchDeleteSuccess(state, action: PayloadAction<string[]>) {
      const idsToDelete = new Set(action.payload);
      state.songs = state.songs.filter((s) => !idsToDelete.has(s._id));
      state.selectedSongIds = [];
      if (state.currentSong && idsToDelete.has(state.currentSong._id)) {
        state.currentSong = null;
        state.isPlaying = false;
      }
      state.actionLoading = false;
      state.successMessage = `${action.payload.length} songs deleted successfully!`;
    },
    batchDeleteFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.actionLoading = false;
    },

    // 4.2. Batch Import
    batchCreateStart(state, _action: PayloadAction<CreateSongDTO[]>) {
      state.actionLoading = true;
      state.error = null;
      state.successMessage = null;
    },
    batchCreateSuccess(state, action: PayloadAction<Song[]>) {
      state.songs = [...action.payload, ...state.songs];
      state.actionLoading = false;
      state.isExportImportOpen = false;
      state.successMessage = `Imported ${action.payload.length} songs successfully!`;
    },
    batchCreateFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.actionLoading = false;
    },

    // 4.3. Toggle Favorite
    toggleFavoriteStart(state, action: PayloadAction<string>) {
      const song = state.songs.find((s) => s._id === action.payload);
      if (song) {
        song.isFavorite = !song.isFavorite;
        if (state.currentSong?._id === song._id) {
          state.currentSong.isFavorite = song.isFavorite;
        }
      }
    },

    // 5. Fetch statistics
    fetchStatsStart(state) {
      state.error = null;
    },
    fetchStatsSuccess(state, action: PayloadAction<Statistics>) {
      state.statistics = action.payload;
    },
    fetchStatsFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },

    // 6. Navigation & View Modes
    setActiveTab(state, action: PayloadAction<"all" | "favorites">) {
      state.activeTab = action.payload;
    },
    setViewMode(state, action: PayloadAction<"cards" | "analytics">) {
      state.viewMode = action.payload;
    },

    // 7. Selection Actions
    toggleSelectSong(state, action: PayloadAction<string>) {
      if (state.selectedSongIds.includes(action.payload)) {
        state.selectedSongIds = state.selectedSongIds.filter((id) => id !== action.payload);
      } else {
        state.selectedSongIds.push(action.payload);
      }
    },
    selectAllSongs(state, action: PayloadAction<string[]>) {
      state.selectedSongIds = action.payload;
    },
    clearSelectedSongs(state) {
      state.selectedSongIds = [];
    },

    // 8. Player Actions
    playSong(state, action: PayloadAction<Song>) {
      state.currentSong = action.payload;
      state.isPlaying = true;
    },
    togglePlayPause(state) {
      if (state.currentSong) {
        state.isPlaying = !state.isPlaying;
      }
    },
    setIsPlaying(state, action: PayloadAction<boolean>) {
      state.isPlaying = action.payload;
    },
    setVolume(state, action: PayloadAction<number>) {
      state.volume = Math.max(0, Math.min(1, action.payload));
    },
    playNext(state) {
      if (!state.currentSong || state.songs.length === 0) return;
      const currentIndex = state.songs.findIndex((s) => s._id === state.currentSong?._id);
      const nextIndex = (currentIndex + 1) % state.songs.length;
      state.currentSong = state.songs[nextIndex];
      state.isPlaying = true;
    },
    playPrev(state) {
      if (!state.currentSong || state.songs.length === 0) return;
      const currentIndex = state.songs.findIndex((s) => s._id === state.currentSong?._id);
      const prevIndex = currentIndex <= 0 ? state.songs.length - 1 : currentIndex - 1;
      state.currentSong = state.songs[prevIndex];
      state.isPlaying = true;
    },

    // 9. Modals & Drawers
    setActiveLyricsSong(state, action: PayloadAction<Song | null>) {
      state.activeLyricsSong = action.payload;
    },
    setExportImportOpen(state, action: PayloadAction<boolean>) {
      state.isExportImportOpen = action.payload;
    },

    // Clear alerts/messages
    clearNotification(state) {
      state.error = null;
      state.successMessage = null;
    },
  },
});

export const {
  fetchSongsStart,
  fetchSongsSuccess,
  fetchSongsFailure,
  createSongStart,
  createSongSuccess,
  createSongFailure,
  updateSongStart,
  updateSongSuccess,
  updateSongFailure,
  deleteSongStart,
  deleteSongSuccess,
  deleteSongFailure,
  batchDeleteStart,
  batchDeleteSuccess,
  batchDeleteFailure,
  batchCreateStart,
  batchCreateSuccess,
  batchCreateFailure,
  toggleFavoriteStart,
  fetchStatsStart,
  fetchStatsSuccess,
  fetchStatsFailure,
  setActiveTab,
  setViewMode,
  toggleSelectSong,
  selectAllSongs,
  clearSelectedSongs,
  playSong,
  togglePlayPause,
  setIsPlaying,
  setVolume,
  playNext,
  playPrev,
  setActiveLyricsSong,
  setExportImportOpen,
  clearNotification,
} = songSlice.actions;

export default songSlice.reducer;