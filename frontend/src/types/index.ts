export interface Song {
  _id: string;
  title: string;
  artist: string;
  album: string;
  genre: string;
  duration?: string;
  releaseYear?: number;
  coverArt?: string;
  audioUrl?: string;
  lyrics?: string;
  isFavorite?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSongDTO {
  title: string;
  artist: string;
  album: string;
  genre: string;
  duration?: string;
  releaseYear?: number;
  coverArt?: string;
  audioUrl?: string;
  lyrics?: string;
  isFavorite?: boolean;
}

export interface UpdateSongDTO {
  title?: string;
  artist?: string;
  album?: string;
  genre?: string;
  duration?: string;
  releaseYear?: number;
  coverArt?: string;
  audioUrl?: string;
  lyrics?: string;
  isFavorite?: boolean;
}

export interface Statistics {
  totalSongs: number;
  totalArtists?: number;
  totalAlbums?: number;
  totalGenres?: number;
  songsPerGenre: Array<{ _id: string; count: number }>;
  songsPerArtist: Array<{ _id: string; count: number }>;
  songsPerAlbum: Array<{ _id: string; count: number }>;
  albumsPerArtist: Array<{ _id: string; count: number }>;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  favorites: string[];
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  count?: number;
  data: T;
}