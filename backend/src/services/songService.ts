import { Song, ISongDocument } from "../models/Song";
import { ICreateSongDTO, IUpdateSongDTO, IStatistics } from "../types/song";

export class SongService {
  // 1. Create a new song
  static async createSong(data: ICreateSongDTO): Promise<ISongDocument> {
    const song = new Song(data);
    return await song.save();
  }

  // 2. Get all songs (with optional genre filtering)
  static async getAllSongs(genre?: string): Promise<ISongDocument[]> {
    const filter = genre ? { genre: { $regex: new RegExp(`^${genre}$`, "i") } } : {};
    return await Song.find(filter).sort({ createdAt: -1 });
  }

  // 3. Get a single song by ID
  static async getSongById(id: string): Promise<ISongDocument | null> {
    return await Song.findById(id);
  }

  // 4. Update a song by ID
  static async updateSong(
    id: string,
    data: IUpdateSongDTO
  ): Promise<ISongDocument | null> {
    return await Song.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }

  // 5. Delete a song by ID
  static async deleteSong(id: string): Promise<ISongDocument | null> {
    return await Song.findByIdAndDelete(id);
  }

  // 5.1. Batch delete songs by array of IDs
  static async batchDeleteSongs(ids: string[]): Promise<number> {
    const result = await Song.deleteMany({ _id: { $in: ids } });
    return result.deletedCount || 0;
  }

  // 5.2. Batch create/import songs
  static async batchCreateSongs(songs: ICreateSongDTO[]): Promise<ISongDocument[]> {
    return await Song.insertMany(songs) as unknown as ISongDocument[];
  }

  // 6. Generate overall statistics using aggregation pipelines
  static async getStatistics(): Promise<IStatistics> {
    const [
      totalSongs,
      distinctArtists,
      distinctAlbums,
      distinctGenres,
      songsPerGenre,
      songsPerArtist,
      songsPerAlbum,
      albumsPerArtist,
    ] = await Promise.all([
      // 1. Total count of all songs
      Song.countDocuments(),

      // 2. Distinct count of unique artists
      Song.distinct("artist"),

      // 3. Distinct count of unique albums
      Song.distinct("album"),

      // 4. Distinct count of unique genres
      Song.distinct("genre"),

      // 5. # of songs in every genre
      Song.aggregate([
        { $group: { _id: "$genre", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),

      // 6. # of songs each artist has
      Song.aggregate([
        { $group: { _id: "$artist", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),

      // 7. # of songs in each album
      Song.aggregate([
        { $group: { _id: "$album", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),

      // 8. # of albums each artist has
      Song.aggregate([
        { $group: { _id: { artist: "$artist", album: "$album" } } },
        { $group: { _id: "$_id.artist", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
    ]);

    return {
      totalSongs,
      totalArtists: distinctArtists.length,
      totalAlbums: distinctAlbums.length,
      totalGenres: distinctGenres.length,
      songsPerGenre,
      songsPerArtist,
      songsPerAlbum,
      albumsPerArtist,
    };
  }
}