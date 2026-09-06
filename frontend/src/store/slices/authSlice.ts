import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../types";

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  authModalOpen: boolean;
  authModalTab: "login" | "signup";
}

const savedToken = localStorage.getItem("auratune_token");
const savedUserStr = localStorage.getItem("auratune_user");
let savedUser: User | null = null;
if (savedUserStr) {
  try {
    savedUser = JSON.parse(savedUserStr);
  } catch {
    savedUser = null;
  }
}

const initialState: AuthState = {
  user: savedUser,
  token: savedToken,
  isAuthenticated: !!savedToken && !!savedUser,
  loading: false,
  error: null,
  authModalOpen: false,
  authModalTab: "login",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
      state.authModalOpen = false;
      localStorage.setItem("auratune_token", action.payload.token);
      localStorage.setItem("auratune_user", JSON.stringify(action.payload.user));
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      localStorage.removeItem("auratune_token");
      localStorage.removeItem("auratune_user");
    },
    openAuthModal(state, action: PayloadAction<"login" | "signup">) {
      state.authModalTab = action.payload || "login";
      state.authModalOpen = true;
      state.error = null;
    },
    closeAuthModal(state) {
      state.authModalOpen = false;
      state.error = null;
    },
    setAuthLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setAuthError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.loading = false;
    },
    updateUserFavorites(state, action: PayloadAction<string[]>) {
      if (state.user) {
        state.user.favorites = action.payload;
        localStorage.setItem("auratune_user", JSON.stringify(state.user));
      }
    },
  },
});

export const {
  setCredentials,
  logout,
  openAuthModal,
  closeAuthModal,
  setAuthLoading,
  setAuthError,
  updateUserFavorites,
} = authSlice.actions;

export default authSlice.reducer;
