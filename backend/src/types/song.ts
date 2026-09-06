export interface ISong {
  _id?: string;
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
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICreateSongDTO {
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

export interface IUpdateSongDTO {
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

export interface IStatistics {
  totalSongs: number;
  totalArtists: number;
  totalAlbums: number;
  totalGenres: number;
  songsPerGenre: Array<{ _id: string; count: number }>;
  songsPerArtist: Array<{ _id: string; count: number }>;
  songsPerAlbum: Array<{ _id: string; count: number }>;
  albumsPerArtist: Array<{ _id: string; count: number }>;
}