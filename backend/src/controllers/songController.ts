import { Request, Response, NextFunction } from "express";
import { SongService } from "../services/songService";

export class SongController {
  // 1. POST /api/songs -> Create a new song
  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const song = await SongService.createSong(req.body);
      res.status(201).json({ success: true, data: song });
    } catch (error) {
      next(error);
    }
  }

  // 2. GET /api/songs -> Fetch all songs (with optional ?genre=Rock query)
  static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { genre } = req.query;
      const songs = await SongService.getAllSongs(genre as string | undefined);
      res.status(200).json({ success: true, count: songs.length, data: songs });
    } catch (error) {
      next(error);
    }
  }

  // 3. GET /api/songs/:id -> Fetch a single song by its ID
  static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const song = await SongService.getSongById(req.params.id);
      if (!song) {
        res.status(404).json({ success: false, message: "Song not found" });
        return;
      }
      res.status(200).json({ success: true, data: song });
    } catch (error) {
      next(error);
    }
  }

  // 4. PATCH /api/songs/:id -> Update fields on an existing song
  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const song = await SongService.updateSong(req.params.id, req.body);
      if (!song) {
        res.status(404).json({ success: false, message: "Song not found" });
        return;
      }
      res.status(200).json({ success: true, data: song });
    } catch (error) {
      next(error);
    }
  }

  // 5. DELETE /api/songs/:id -> Delete a song by ID
  static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const song = await SongService.deleteSong(req.params.id);
      if (!song) {
        res.status(404).json({ success: false, message: "Song not found" });
        return;
      }
      res.status(200).json({ success: true, message: "Song deleted successfully" });
    } catch (error) {
      next(error);
    }
  }

  // 6. GET /api/songs/statistics -> Fetch aggregated statistics
  static async getStatistics(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const stats = await SongService.getStatistics();
      res.status(200).json({ success: true, data: stats });
    } catch (error) {
      next(error);
    }
  }
}