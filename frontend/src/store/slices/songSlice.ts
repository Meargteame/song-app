import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Song, Statistics } from "../../types";

// 1. What does our notebook hold?
interface SongState {
  songs: Song[];
  statistics: Statistics | null;
  loading: boolean;
  error: string | null;
}

// 2. What does the notebook look like when the app first opens?
const initialState: SongState = {
  songs: [],
  statistics: null,
  loading: false,
  error: null,
};

// 3. The slice: rules for writing into our notebook
const songSlice = createSlice({
  name: "songs",
  initialState,
  reducers: {
    // When an API request starts, turn on the loading spinner
    fetchSongsStart(state) {
      state.loading = true;
      state.error = null;
    },
    // When the backend replies with songs, save them into the notebook
    fetchSongsSuccess(state, action: PayloadAction<Song[]>) {
      state.songs = action.payload;
      state.loading = false;
    },
    // If the server fails or goes down, record the error message
    fetchSongsFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { fetchSongsStart, fetchSongsSuccess, fetchSongsFailure } =
  songSlice.actions;

export default songSlice.reducer;