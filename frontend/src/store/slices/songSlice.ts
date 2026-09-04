import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Song, Statistics, CreateSongDTO, UpdateSongDTO } from "../../types";

export interface SongState {
  songs: Song[];
  statistics: Statistics | null;
  loading: boolean;
  actionLoading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: SongState = {
  songs: [],
  statistics: null,
  loading: false,
  actionLoading: false,
  error: null,
  successMessage: null,
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
      state.songs = action.payload;
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
      state.actionLoading = false;
      state.successMessage = "Song deleted successfully!";
    },
    deleteSongFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.actionLoading = false;
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
  fetchStatsStart,
  fetchStatsSuccess,
  fetchStatsFailure,
  clearNotification,
} = songSlice.actions;

export default songSlice.reducer;