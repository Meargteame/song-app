import axios from "axios";
import { ApiResponse, User } from "../types";

const rawBaseUrl = import.meta.env.VITE_API_URL || "";
const sanitizedBaseUrl = rawBaseUrl.endsWith("/")
  ? rawBaseUrl.slice(0, -1)
  : rawBaseUrl;

const api = axios.create({
  baseURL: sanitizedBaseUrl ? `${sanitizedBaseUrl}/api/auth` : "/api/auth",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach Authorization Bearer token to all requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auratune_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface LoginDTO {
  email: string;
  password?: string;
}

export interface RegisterDTO {
  name: string;
  email: string;
  password?: string;
  role?: "admin" | "user";
}

export interface AuthResponseData {
  user: User;
  token: string;
}

export const login = async (email: string, password?: string) => {
  const res = await api.post<ApiResponse<AuthResponseData>>("/login", { email, password });
  return res.data.data;
};

export const register = async (name: string, email: string, password?: string, role: "admin" | "user" = "user") => {
  const res = await api.post<ApiResponse<AuthResponseData>>("/register", { name, email, password, role });
  return res.data.data;
};

export const getMe = async () => {
  const res = await api.get<ApiResponse<User>>("/me");
  return res.data.data;
};

export const toggleFavorite = async (songId: string) => {
  const res = await api.post<ApiResponse<{ songId: string; isFavorite: boolean; favorites: string[] }>>(`/favorites/${songId}`);
  return res.data;
};

export const authApi = {
  login,
  register,
  getMe,
  toggleFavorite,
};

export default authApi;
