import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { CreateSongDTO, Song } from "../types";
import { theme, Button } from "../styles";

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: ${theme.colors.cardBg};
  border: 1px solid ${theme.colors.cardBorder};
  border-radius: 12px;
  width: 90%;
  max-width: 480px;
  padding: 1.75rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;

  label {
    display: block;
    margin-bottom: 0.35rem;
    font-size: 0.85rem;
    color: ${theme.colors.textSecondary};
  }

  input {
    width: 100%;
    padding: 0.6rem;
    border-radius: 6px;
    border: 1px solid ${theme.colors.cardBorder};
    background: ${theme.colors.background};
    color: ${theme.colors.textPrimary};
    box-sizing: border-box;

    &:focus {
      outline: none;
      border-color: ${theme.colors.primary};
    }
  }
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.5rem;
`;

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
    onSubmit(formData);
    onClose();
  };

  return (
    <Overlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <h2 style={{ marginTop: 0, color: theme.colors.textPrimary }}>
          {initialData ? "Edit Song" : "Add New Song"}
        </h2>
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <label>Song Title</label>
            <input
              required
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
              value={formData.genre}
              onChange={(e) =>
                setFormData({ ...formData, genre: e.target.value })
              }
            />
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