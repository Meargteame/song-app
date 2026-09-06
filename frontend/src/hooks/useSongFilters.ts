import { useState, useMemo } from "react";
import { Song } from "../types";

interface UseSongFiltersProps {
  songs: Song[];
  activeTab: "all" | "favorites";
}

export const useSongFilters = ({ songs, activeTab }: UseSongFiltersProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");

  const filteredSongs = useMemo(() => {
    let result = songs || [];

    // 1. Filter by Active Tab
    if (activeTab === "favorites") {
      result = result.filter((song) => song.isFavorite);
    }

    // 2. Filter by Genre (client-side matching fallback)
    if (selectedGenre) {
      result = result.filter(
        (song) => song.genre.toLowerCase() === selectedGenre.toLowerCase()
      );
    }

    // 3. Filter by Search Query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        (song) =>
          song.title.toLowerCase().includes(query) ||
          song.artist.toLowerCase().includes(query) ||
          song.album.toLowerCase().includes(query) ||
          song.genre.toLowerCase().includes(query) ||
          (song.releaseYear && String(song.releaseYear).includes(query))
      );
    }

    return result;
  }, [songs, activeTab, selectedGenre, searchQuery]);

  const favoritesCount = useMemo(() => {
    return (songs || []).filter((s) => s.isFavorite).length;
  }, [songs]);

  return {
    searchQuery,
    setSearchQuery,
    selectedGenre,
    setSelectedGenre,
    filteredSongs,
    favoritesCount,
  };
};
