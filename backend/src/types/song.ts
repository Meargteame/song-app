export interface ISong {
  _id?: string;
  title: string;
  artist: string;
  album: string;
  genre: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICreateSongDTO {
  title: string;
  artist: string;
  album: string;
  genre: string;
}

export interface IUpdateSongDTO {
  title?: string;
  artist?: string;
  album?: string;
  genre?: string;
}

export interface IStatistics {
  totalSongs: number;
  songsPerGenre: Array<{ _id: string; count: number }>;
  songsPerArtist: Array<{ _id: string; count: number }>;
  songsPerAlbum: Array<{ _id: string; count: number }>;
  albumsPerArtist: Array<{ _id: string; count: number }>;
}