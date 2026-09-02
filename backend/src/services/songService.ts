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

  // 6. Generate overall statistics using aggregation pipelines
  static async getStatistics(): Promise<IStatistics> {
    const [
      totalSongs,
      songsPerGenre,
      songsPerArtist,
      songsPerAlbum,
      albumsPerArtist,
    ] = await Promise.all([
      // Total count of all songs
      Song.countDocuments(),

      // Count of songs grouped by genre
      Song.aggregate([
        { $group: { _id: "$genre", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),

      // Count of songs grouped by artist
      Song.aggregate([
        { $group: { _id: "$artist", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),

      // Count of songs grouped by album
      Song.aggregate([
        { $group: { _id: "$album", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),

      // Count of distinct albums per artist
      Song.aggregate([
        { $group: { _id: { artist: "$artist", album: "$album" } } },
        { $group: { _id: "$_id.artist", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
    ]);

    return {
      totalSongs,
      songsPerGenre,
      songsPerArtist,
      songsPerAlbum,
      albumsPerArtist,
    };
  }
}