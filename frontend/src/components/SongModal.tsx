import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { CreateSongDTO, Song } from "../types";
import { theme, Button } from "../styles";

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1200;
  padding: 1rem;
`;

const ModalContent = styled.div`
  background: ${theme.colors.cardBg};
  border: 1px solid ${theme.colors.cardBorderHover};
  border-radius: 12px;
  width: 100%;
  max-width: 540px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: ${theme.shadows.popover};
  box-sizing: border-box;
  overflow: hidden;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid ${theme.colors.cardBorder};
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 1.15rem;
  font-weight: 600;
  color: ${theme.colors.textPrimary};
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: ${theme.colors.textMuted};
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0.25rem;
  line-height: 1;

  &:hover {
    color: ${theme.colors.textPrimary};
  }
`;

const FormScrollArea = styled.div`
  padding: 1.5rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const TwoColumnRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.85rem;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;

  label {
    font-size: 0.8rem;
    font-weight: 500;
    color: ${theme.colors.textSecondary};
  }

  input,
  textarea {
    width: 100%;
    padding: 0.6rem 0.8rem;
    border-radius: 6px;
    border: 1px solid ${theme.colors.cardBorder};
    background: ${theme.colors.inputBg};
    color: ${theme.colors.textPrimary};
    font-size: 0.875rem;
    box-sizing: border-box;
    font-family: inherit;

    &:focus {
      outline: none;
      border-color: ${theme.colors.cardBorderHover};
    }

    &::placeholder {
      color: ${theme.colors.textMuted};
    }
  }

  textarea {
    resize: vertical;
    min-height: 80px;
    line-height: 1.5;
  }
`;

const GenreQuickPills = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  margin-top: 0.35rem;
`;

const Pill = styled.button<{ selected: boolean }>`
  font-size: 0.72rem;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  border: 1px solid
    ${({ selected }) => (selected ? "var(--tab-active-border)" : theme.colors.cardBorder)};
  background: ${({ selected }) => (selected ? "var(--tab-active-bg)" : theme.colors.surface)};
  color: ${({ selected }) => (selected ? theme.colors.textPrimary : theme.colors.textMuted)};
  cursor: pointer;

  &:hover {
    color: ${theme.colors.textPrimary};
    background: var(--tab-active-bg);
  }
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.6rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid ${theme.colors.cardBorder};
  background: ${theme.colors.surface};
`;

const COMMON_GENRES = ["Rock", "Pop", "Jazz", "Hip Hop", "Electronic", "R&B", "Classical", "Reggae", "Blues", "Acoustic"];

interface SongModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: CreateSongDTO) => void;
  initialData?: Song | null;
}

export const SongModal: React.FC<SongModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [formData, setFormData] = useState<CreateSongDTO>({
    title: "",
    artist: "",
    album: "",
    genre: "",
    duration: "",
    releaseYear: undefined,
    coverArt: "",
    audioUrl: "",
    lyrics: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        artist: initialData.artist,
        album: initialData.album,
        genre: initialData.genre,
        duration: initialData.duration || "",
        releaseYear: initialData.releaseYear || undefined,
        coverArt: initialData.coverArt || "",
        audioUrl: initialData.audioUrl || "",
        lyrics: initialData.lyrics || "",
      });
    } else {
      setFormData({
        title: "",
        artist: "",
        album: "",
        genre: "",
        duration: "",
        releaseYear: undefined,
        coverArt: "",
        audioUrl: "",
        lyrics: "",
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.artist.trim()) return;
    onSubmit(formData);
    onClose();
  };

  return (
    <Overlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            {initialData ? "Edit Song Details" : "Add New Song"}
          </ModalTitle>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </ModalHeader>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <FormScrollArea>
            <FormGroup>
              <label>Song Title *</label>
              <input
                required
                placeholder="e.g. Bohemian Rhapsody"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </FormGroup>

            <TwoColumnRow>
              <FormGroup>
                <label>Artist *</label>
                <input
                  required
                  placeholder="e.g. Queen"
                  value={formData.artist}
                  onChange={(e) =>
                    setFormData({ ...formData, artist: e.target.value })
                  }
                />
              </FormGroup>
              <FormGroup>
                <label>Album *</label>
                <input
                  required
                  placeholder="e.g. A Night at the Opera"
                  value={formData.album}
                  onChange={(e) =>
                    setFormData({ ...formData, album: e.target.value })
                  }
                />
              </FormGroup>
            </TwoColumnRow>

            <FormGroup>
              <label>Genre *</label>
              <input
                required
                placeholder="e.g. Rock"
                value={formData.genre}
                onChange={(e) =>
                  setFormData({ ...formData, genre: e.target.value })
                }
              />
              <GenreQuickPills>
                {COMMON_GENRES.map((g) => (
                  <Pill
                    type="button"
                    key={g}
                    selected={formData.genre.toLowerCase() === g.toLowerCase()}
                    onClick={() => setFormData({ ...formData, genre: g })}
                  >
                    {g}
                  </Pill>
                ))}
              </GenreQuickPills>
            </FormGroup>

            <TwoColumnRow>
              <FormGroup>
                <label>Duration (mm:ss)</label>
                <input
                  placeholder="e.g. 3:45"
                  value={formData.duration || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, duration: e.target.value })
                  }
                />
              </FormGroup>
              <FormGroup>
                <label>Release Year</label>
                <input
                  type="number"
                  placeholder="e.g. 1975"
                  value={formData.releaseYear || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      releaseYear: e.target.value ? Number(e.target.value) : undefined,
                    })
                  }
                />
              </FormGroup>
            </TwoColumnRow>

            <FormGroup>
              <label>Cover Artwork URL (Optional)</label>
              <input
                placeholder="e.g. https://images.unsplash.com/..."
                value={formData.coverArt || ""}
                onChange={(e) =>
                  setFormData({ ...formData, coverArt: e.target.value })
                }
              />
            </FormGroup>

            <FormGroup>
              <label>Audio Stream / Preview URL (Optional)</label>
              <input
                placeholder="e.g. https://example.com/audio.mp3"
                value={formData.audioUrl || ""}
                onChange={(e) =>
                  setFormData({ ...formData, audioUrl: e.target.value })
                }
              />
            </FormGroup>

            <FormGroup>
              <label>Lyrics (Optional)</label>
              <textarea
                placeholder="Paste song lyrics here..."
                value={formData.lyrics || ""}
                onChange={(e) =>
                  setFormData({ ...formData, lyrics: e.target.value })
                }
              />
            </FormGroup>
          </FormScrollArea>

          <ModalActions>
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {initialData ? "Save Changes" : "Create Song"}
            </Button>
          </ModalActions>
        </form>
      </ModalContent>
    </Overlay>
  );
};