export interface Song {
  _id: string;
  title: string;
  artist: string;
  album: string;
  genre: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSongDTO {
  title: string;
  artist: string;
  album: string;
  genre: string;
}

export interface UpdateSongDTO {
  title?: string;
  artist?: string;
  album?: string;
  genre?: string;
}

export interface Statistics {
  totalSongs: number;
  songsPerGenre: Array<{ _id: string; count: number }>;
  songsPerArtist: Array<{ _id: string; count: number }>;
  songsPerAlbum: Array<{ _id: string; count: number }>;
  albumsPerArtist: Array<{ _id: string; count: number }>;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  count?: number;
  data: T;
}