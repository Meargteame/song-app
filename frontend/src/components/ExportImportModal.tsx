import React, { useState, useRef } from "react";
import styled from "@emotion/styled";
import { theme, Button } from "../styles";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setExportImportOpen, batchCreateStart } from "../store/slices/songSlice";
import { CreateSongDTO } from "../types";

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(6px);
  z-index: 1500;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
`;

const ModalContainer = styled.div`
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.cardBorderHover};
  border-radius: 12px;
  width: 100%;
  max-width: 520px;
  box-shadow: ${theme.shadows.popover};
  overflow: hidden;
  animation: fadeIn 0.2s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const ModalHeader = styled.div`
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid ${theme.colors.cardBorder};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ModalTitle = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: ${theme.colors.textPrimary};
`;

const ModalBody = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const SectionBox = styled.div`
  background: ${theme.colors.cardBg};
  border: 1px solid ${theme.colors.cardBorder};
  border-radius: 8px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const SectionHeader = styled.div`
  font-size: 0.9rem;
  font-weight: 600;
  color: ${theme.colors.textPrimary};
  display: flex;
  align-items: center;
  gap: 0.4rem;
`;

const SectionDesc = styled.p`
  margin: 0;
  font-size: 0.8rem;
  color: ${theme.colors.textSecondary};
  line-height: 1.4;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 0.6rem;
  margin-top: 0.25rem;
`;

const ErrorMsg = styled.div`
  color: ${theme.colors.danger};
  font-size: 0.8rem;
  background: ${theme.colors.dangerBg};
  border: 1px solid ${theme.colors.dangerBorder};
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
`;

export const ExportImportModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.songs.isExportImportOpen);
  const songs = useAppSelector((state) => state.songs.songs);
  const [importError, setImportError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) {
    return null;
  }

  const handleClose = () => {
    dispatch(setExportImportOpen(false));
    setImportError(null);
  };

  // Export as JSON
  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(songs, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `song_catalog_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Export as CSV
  const handleExportCSV = () => {
    const headers = ["Title", "Artist", "Album", "Genre", "Duration", "Release Year", "Is Favorite"];
    const rows = songs.map((s) => [
      `"${s.title.replace(/"/g, '""')}"`,
      `"${s.artist.replace(/"/g, '""')}"`,
      `"${s.album.replace(/"/g, '""')}"`,
      `"${s.genre.replace(/"/g, '""')}"`,
      `"${s.duration || ""}"`,
      `"${s.releaseYear || ""}"`,
      `"${s.isFavorite ? "Yes" : "No"}"`,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `song_catalog_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  // Import JSON File
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (!Array.isArray(parsed)) {
          throw new Error("Uploaded JSON must be an array of songs.");
        }

        const validSongs: CreateSongDTO[] = parsed.map((item: any) => {
          if (!item.title || !item.artist || !item.album || !item.genre) {
            throw new Error("Each song item must contain title, artist, album, and genre.");
          }
          return {
            title: String(item.title).trim(),
            artist: String(item.artist).trim(),
            album: String(item.album).trim(),
            genre: String(item.genre).trim(),
            duration: item.duration ? String(item.duration).trim() : undefined,
            releaseYear: item.releaseYear ? Number(item.releaseYear) : undefined,
            coverArt: item.coverArt ? String(item.coverArt).trim() : undefined,
            audioUrl: item.audioUrl ? String(item.audioUrl).trim() : undefined,
            lyrics: item.lyrics ? String(item.lyrics) : undefined,
            isFavorite: Boolean(item.isFavorite),
          };
        });

        dispatch(batchCreateStart(validSongs));
      } catch (err: any) {
        setImportError(err.message || "Failed to parse JSON file.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <Backdrop onClick={handleClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Export & Import Songs</ModalTitle>
          <Button variant="outline" size="sm" onClick={handleClose}>
            ✕
          </Button>
        </ModalHeader>

        <ModalBody>
          {/* Export Section */}
          <SectionBox>
            <SectionHeader>⬇️ Export Catalog</SectionHeader>
            <SectionDesc>
              Download your entire catalog of {songs.length} songs for backup or spreadsheet analysis.
            </SectionDesc>
            <ButtonRow>
              <Button variant="secondary" size="sm" onClick={handleExportJSON}>
                📄 Export JSON
              </Button>
              <Button variant="secondary" size="sm" onClick={handleExportCSV}>
                📊 Export CSV
              </Button>
            </ButtonRow>
          </SectionBox>

          {/* Import Section */}
          <SectionBox>
            <SectionHeader>⬆️ Import Songs from JSON</SectionHeader>
            <SectionDesc>
              Upload a JSON backup file to bulk add songs into your catalog.
            </SectionDesc>
            <input
              type="file"
              accept=".json"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            <ButtonRow>
              <Button
                variant="primary"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                📁 Choose JSON File
              </Button>
            </ButtonRow>
            {importError && <ErrorMsg>{importError}</ErrorMsg>}
          </SectionBox>
        </ModalBody>
      </ModalContainer>
    </Backdrop>
  );
};
