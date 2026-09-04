import mongoose, { Schema, Document } from "mongoose";
import { ISong } from "../types/song";

export interface ISongDocument extends Omit<ISong, "_id">, Document {}

const SongSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Song title is required"],
      trim: true,
    },
    artist: {
      type: String,
      required: [true, "Artist name is required"],
      trim: true,
    },
    album: {
      type: String,
      required: [true, "Album name is required"],
      trim: true,
    },
    genre: {
      type: String,
      required: [true, "Genre is required"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Song = mongoose.model<ISongDocument>("Song", SongSchema);