import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { CreateSongDTO, Song } from "../types";
import { theme, Button } from "../styles";

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContent = styled.div`
  background: #141417;
  border: 1px solid ${theme.colors.cardBorderHover};
  border-radius: 12px;
  width: 100%;
  max-width: 480px;
  padding: 1.75rem;
  box-shadow: ${theme.shadows.popover};
  box-sizing: border-box;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid ${theme.colors.cardBorder};
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 1.2rem;
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

const FormGroup = styled.div`
  margin-bottom: 1rem;

  label {
    display: block;
    margin-bottom: 0.35rem;
    font-size: 0.8rem;
    font-weight: 500;
    color: ${theme.colors.textSecondary};
  }

  input {
    width: 100%;
    padding: 0.6rem 0.8rem;
    border-radius: 6px;
    border: 1px solid ${theme.colors.cardBorder};
    background: #09090b;
    color: ${theme.colors.textPrimary};
    font-size: 0.9rem;
    box-sizing: border-box;

    &:focus {
      outline: none;
      border-color: #52525b;
    }
  }
`;

const GenreQuickPills = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  margin-top: 0.5rem;
`;

const Pill = styled.button<{ selected: boolean }>`
  font-size: 0.75rem;
  padding: 0.2rem 0.55rem;
  border-radius: 4px;
  border: 1px solid
    ${({ selected }) => (selected ? "#52525b" : theme.colors.cardBorder)};
  background: ${({ selected }) => (selected ? "#27272a" : theme.colors.surface)};
  color: ${({ selected }) => (selected ? theme.colors.textPrimary : theme.colors.textMuted)};
  cursor: pointer;

  &:hover {
    color: ${theme.colors.textPrimary};
    background: #27272a;
  }
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.6rem;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid ${theme.colors.cardBorder};
`;

const COMMON_GENRES = ["Rock", "Pop", "Jazz", "Hip Hop", "Electronic", "R&B", "Classical", "Reggae", "Blues"];

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
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        artist: initialData.artist,
        album: initialData.album,
        genre: initialData.genre,
      });
    } else {
      setFormData({ title: "", artist: "", album: "", genre: "" });
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
            {initialData ? "Edit Song" : "Add Song"}
          </ModalTitle>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </ModalHeader>

        <form onSubmit={handleSubmit}>
          <FormGroup>
            <label>Song Title</label>
            <input
              required
              placeholder="e.g. Bohemian Rhapsody"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </FormGroup>

          <FormGroup>
            <label>Artist</label>
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
            <label>Album</label>
            <input
              required
              placeholder="e.g. A Night at the Opera"
              value={formData.album}
              onChange={(e) =>
                setFormData({ ...formData, album: e.target.value })
              }
            />
          </FormGroup>

          <FormGroup>
            <label>Genre</label>
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