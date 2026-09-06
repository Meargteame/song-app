import { useState, useMemo } from "react";
import { Song } from "../types";

export type SortOption = "newest" | "oldest" | "title" | "artist" | "genre";

interface UseSongFiltersProps {
  songs: Song[];
  activeTab: "all" | "favorites";
}

export const useSongFilters = ({ songs, activeTab }: UseSongFiltersProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");

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

    // 4. Sort
    const sorted = [...result];
    switch (sortBy) {
      case "newest":
        sorted.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case "oldest":
        sorted.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        break;
      case "title":
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "artist":
        sorted.sort((a, b) => a.artist.localeCompare(b.artist));
        break;
      case "genre":
        sorted.sort((a, b) => a.genre.localeCompare(b.genre));
        break;
    }

    return sorted;
  }, [songs, activeTab, selectedGenre, searchQuery, sortBy]);

  const favoritesCount = useMemo(() => {
    return (songs || []).filter((s) => s.isFavorite).length;
  }, [songs]);

  return {
    searchQuery,
    setSearchQuery,
    selectedGenre,
    setSelectedGenre,
    sortBy,
    setSortBy,
    filteredSongs,
    favoritesCount,
  };
};
