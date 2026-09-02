import axios from "axios";
import {
  Song,
  CreateSongDTO,
  UpdateSongDTO,
  Statistics,
  ApiResponse,
} from "../types";

// Create a pre-configured Axios instance
const api = axios.create({
  baseURL: "/api/songs",
  headers: {
    "Content-Type": "application/json",
  },
});

export const songApi = {
  // 1. Fetch all songs (optional genre filter)
  getAll: (genre?: string) =>
    api
      .get<ApiResponse<Song[]>>("/", { params: genre ? { genre } : {} })
      .then((res) => res.data),

  // 2. Fetch a single song by ID
  getById: (id: string) =>
    api.get<ApiResponse<Song>>(`/${id}`).then((res) => res.data),

  // 3. Create a new song
  create: (data: CreateSongDTO) =>
    api.post<ApiResponse<Song>>("/", data).then((res) => res.data),

  // 4. Update an existing song
  update: (id: string, data: UpdateSongDTO) =>
    api.patch<ApiResponse<Song>>(`/${id}`, data).then((res) => res.data),

  // 5. Delete a song
  delete: (id: string) =>
    api.delete<ApiResponse<Song>>(`/${id}`).then((res) => res.data),

  // 6. Fetch overall statistics
  getStatistics: () =>
    api.get<ApiResponse<Statistics>>("/statistics").then((res) => res.data),
};