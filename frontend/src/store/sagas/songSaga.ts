import { call, put, takeLatest, select, all } from "redux-saga/effects";
import { PayloadAction } from "@reduxjs/toolkit";
import { songApi } from "../../api/songApi";
import {
  Song,
  CreateSongDTO,
  UpdateSongDTO,
  Statistics,
  ApiResponse,
} from "../../types";
import {
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
} from "../slices/songSlice";
import { RootState } from "../index";

import { toggleFavorite } from "../../api/authApi";
import { updateUserFavorites } from "../slices/authSlice";

import axios from "axios";

// Helper function to strictly extract error messages without using 'any'
const getErrorMessage = (error: unknown, fallback: string): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message || fallback;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return fallback;
};

// 1. Worker Saga: Fetch Songs
function* handleFetchSongs(action: PayloadAction<string | undefined>) {
  try {
    const response: ApiResponse<Song[]> = yield call(
      songApi.getAll,
      action.payload
    );
    yield put(fetchSongsSuccess(response.data));
  } catch (error: unknown) {
    yield put(fetchSongsFailure(getErrorMessage(error, "Failed to fetch songs")));
  }
}

// 2. Worker Saga: Create Song
function* handleCreateSong(action: PayloadAction<CreateSongDTO>) {
  try {
    const response: ApiResponse<Song> = yield call(
      songApi.create,
      action.payload
    );
    yield put(createSongSuccess(response.data));
    // Automatically re-sync statistics
    yield put(fetchStatsStart());
  } catch (error: unknown) {
    yield put(createSongFailure(getErrorMessage(error, "Failed to create song")));
  }
}

// 3. Worker Saga: Update Song
function* handleUpdateSong(
  action: PayloadAction<{ id: string; data: UpdateSongDTO }>
) {
  try {
    const response: ApiResponse<Song> = yield call(
      songApi.update,
      action.payload.id,
      action.payload.data
    );
    yield put(updateSongSuccess(response.data));
    // Automatically re-sync statistics
    yield put(fetchStatsStart());
  } catch (error: unknown) {
    yield put(updateSongFailure(getErrorMessage(error, "Failed to update song")));
  }
}

// 4. Worker Saga: Delete Song
function* handleDeleteSong(action: PayloadAction<string>) {
  try {
    yield call(songApi.delete, action.payload);
    yield put(deleteSongSuccess(action.payload));
    // Automatically re-sync statistics
    yield put(fetchStatsStart());
  } catch (error: unknown) {
    yield put(deleteSongFailure(getErrorMessage(error, "Failed to delete song")));
  }
}

// 4.1 Worker Saga: Batch Delete Songs
function* handleBatchDelete(action: PayloadAction<string[]>) {
  try {
    yield call(songApi.batchDelete, action.payload);
    yield put(batchDeleteSuccess(action.payload));
    yield put(fetchStatsStart());
  } catch (error: unknown) {
    yield put(
      batchDeleteFailure(getErrorMessage(error, "Failed to delete selected songs"))
    );
  }
}

// 4.2 Worker Saga: Batch Create Songs
function* handleBatchCreate(action: PayloadAction<CreateSongDTO[]>) {
  try {
    const response: ApiResponse<Song[]> = yield call(
      songApi.batchCreate,
      action.payload
    );
    yield put(batchCreateSuccess(response.data));
    yield put(fetchStatsStart());
  } catch (error: unknown) {
    yield put(
      batchCreateFailure(getErrorMessage(error, "Failed to import songs"))
    );
  }
}

// 4.3 Worker Saga: Toggle Favorite
function* handleToggleFavorite(action: PayloadAction<string>) {
  try {
    const song: Song | undefined = yield select((state: RootState) =>
      state.songs.songs.find((s) => s._id === action.payload)
    );
    if (song) {
      yield call(songApi.update, action.payload, { isFavorite: song.isFavorite });
    }
    const token: string | null = yield select((state: RootState) => state.auth.token);
    if (token) {
      const favRes: ApiResponse<{ favorites: string[] }> = yield call(toggleFavorite, action.payload);
      if (favRes.data?.favorites) {
        yield put(updateUserFavorites(favRes.data.favorites));
      }
    }
  } catch (error: unknown) {
    console.error("Failed to sync favorite status to server", error);
  }
}

// 5. Worker Saga: Fetch Statistics
function* handleFetchStats() {
  try {
    const response: ApiResponse<Statistics> = yield call(
      songApi.getStatistics
    );
    yield put(fetchStatsSuccess(response.data));
  } catch (error: unknown) {
    yield put(
      fetchStatsFailure(getErrorMessage(error, "Failed to fetch statistics"))
    );
  }
}

// Watcher Saga: Listens for incoming actions and triggers the right worker
export default function* songSaga() {
  yield all([
    takeLatest(fetchSongsStart.type, handleFetchSongs),
    takeLatest(createSongStart.type, handleCreateSong),
    takeLatest(updateSongStart.type, handleUpdateSong),
    takeLatest(deleteSongStart.type, handleDeleteSong),
    takeLatest(batchDeleteStart.type, handleBatchDelete),
    takeLatest(batchCreateStart.type, handleBatchCreate),
    takeLatest(toggleFavoriteStart.type, handleToggleFavorite),
    takeLatest(fetchStatsStart.type, handleFetchStats),
  ]);
}