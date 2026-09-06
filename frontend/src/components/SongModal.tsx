import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { CreateSongDTO, Song } from "../types";
import { theme, Button } from "../styles";
import { getSongCover } from "../utils/coverArt";

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1200;
  padding: 1rem;
`;

const ModalContent = styled.div`
  background: ${theme.colors.cardBg};
  border: 1px solid ${theme.colors.cardBorderHover};
  border-radius: 14px;
  width: 100%;
  max-width: 580px;
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
  font-size: 1.2rem;
  font-weight: 700;
  color: ${theme.colors.textPrimary};
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: ${theme.colors.textMuted};
  font-size: 1.5rem;
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
  gap: 1.15rem;
`;

const ArtworkPreviewContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1.25rem;
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.cardBorder};
  border-radius: 10px;
  padding: 1rem;
`;

const PreviewImage = styled.img`
  width: 72px;
  height: 72px;
  border-radius: 8px;
  object-fit: cover;
  flex-shrink: 0;
  box-shadow: ${theme.shadows.card};
  border: 1px solid ${theme.colors.cardBorder};
`;

const PreviewMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  overflow: hidden;
`;

const PreviewTitle = styled.div`
  font-weight: 700;
  font-size: 0.95rem;
  color: ${theme.colors.textPrimary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const PreviewSubtitle = styled.div`
  font-size: 0.8rem;
  color: ${theme.colors.textSecondary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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
    font-weight: 600;
    color: ${theme.colors.textSecondary};
  }

  input,
  textarea {
    width: 100%;
    padding: 0.65rem 0.85rem;
    border-radius: 8px;
    border: 1px solid ${theme.colors.cardBorder};
    background: ${theme.colors.inputBg};
    color: ${theme.colors.textPrimary};
    font-size: 0.875rem;
    box-sizing: border-box;
    font-family: inherit;

    &:focus {
      outline: none;
      border-color: var(--music-accent);
    }

    &::placeholder {
      color: ${theme.colors.textMuted};
    }
  }

  textarea {
    resize: vertical;
    min-height: 85px;
    line-height: 1.5;
  }
`;

const QuickPillsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  margin-top: 0.25rem;
`;

const Pill = styled.button<{ selected?: boolean }>`
  font-size: 0.725rem;
  padding: 0.25rem 0.55rem;
  border-radius: 6px;
  border: 1px solid
    ${({ selected }) => (selected ? "var(--music-accent)" : theme.colors.cardBorder)};
  background: ${({ selected }) => (selected ? "var(--music-accent)" : theme.colors.surface)};
  color: ${({ selected }) => (selected ? "#000000" : theme.colors.textSecondary)};
  font-weight: ${({ selected }) => (selected ? "700" : "500")};
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    color: ${({ selected }) => (selected ? "#000000" : theme.colors.textPrimary)};
    background: ${({ selected }) => (selected ? "var(--music-accent-hover)" : theme.colors.surfaceHover)};
  }
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid ${theme.colors.cardBorder};
  background: ${theme.colors.surface};
`;

const FieldError = styled.span`
  font-size: 0.725rem;
  color: var(--color-danger);
  margin-top: 0.15rem;
  font-weight: 500;
`;

const COMMON_GENRES = ["Rock", "Pop", "Jazz", "Hip Hop", "Electronic", "R&B", "Classical", "Reggae", "Blues", "Acoustic"];

const SAMPLE_COVERS = [
  { label: "🎸 Rock Art", url: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=400&auto=format&fit=crop&q=80" },
  { label: "🎤 Pop Art", url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&auto=format&fit=crop&q=80" },
  { label: "🎧 Synth Art", url: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&auto=format&fit=crop&q=80" },
  { label: "🎷 Jazz Art", url: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=400&auto=format&fit=crop&q=80" },
];

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

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);

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
    setTouched({});
    setSubmitted(false);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const errors: Record<string, string> = {};
  if (!formData.title.trim()) errors.title = "Song title is required";
  if (!formData.artist.trim()) errors.artist = "Artist name is required";
  if (!formData.album.trim()) errors.album = "Album name is required";
  if (!formData.genre.trim()) errors.genre = "Genre is required";

  const showError = (field: string) =>
    (touched[field] || submitted) && errors[field];

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (Object.keys(errors).length > 0) return;
    onSubmit(formData);
    onClose();
  };

  const currentCover = getSongCover(formData.title, formData.genre, formData.coverArt);

  return (
    <Overlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            {initialData ? "Edit Track Details" : "Add New Track to Library"}
          </ModalTitle>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </ModalHeader>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <FormScrollArea>
            {/* Live Cover Preview */}
            <ArtworkPreviewContainer>
              <PreviewImage src={currentCover} alt="Cover Preview" />
              <PreviewMeta>
                <PreviewTitle>{formData.title.trim() || "Untitled Track"}</PreviewTitle>
                <PreviewSubtitle>
                  {formData.artist.trim() || "Artist Name"} • {formData.album.trim() || "Album Name"}
                </PreviewSubtitle>
                {formData.genre && (
                  <span style={{ fontSize: "0.725rem", color: "var(--music-accent)", fontWeight: 600 }}>
                    {formData.genre} {formData.duration ? `• ${formData.duration}` : ""}
                  </span>
                )}
              </PreviewMeta>
            </ArtworkPreviewContainer>

            <FormGroup>
              <label>Track Title *</label>
              <input
                placeholder="e.g. Starboy"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                onBlur={() => handleBlur("title")}
                style={showError("title") ? { borderColor: "var(--color-danger)" } : {}}
              />
              {showError("title") && (
                <FieldError>{errors.title}</FieldError>
              )}
            </FormGroup>

            <TwoColumnRow>
              <FormGroup>
                <label>Artist *</label>
                <input
                  placeholder="e.g. The Weeknd"
                  value={formData.artist}
                  onChange={(e) =>
                    setFormData({ ...formData, artist: e.target.value })
                  }
                  onBlur={() => handleBlur("artist")}
                  style={showError("artist") ? { borderColor: "var(--color-danger)" } : {}}
                />
                {showError("artist") && (
                  <FieldError>{errors.artist}</FieldError>
                )}
              </FormGroup>
              <FormGroup>
                <label>Album *</label>
                <input
                  placeholder="e.g. Starboy"
                  value={formData.album}
                  onChange={(e) =>
                    setFormData({ ...formData, album: e.target.value })
                  }
                  onBlur={() => handleBlur("album")}
                  style={showError("album") ? { borderColor: "var(--color-danger)" } : {}}
                />
                {showError("album") && (
                  <FieldError>{errors.album}</FieldError>
                )}
              </FormGroup>
            </TwoColumnRow>

            <FormGroup>
              <label>Genre *</label>
              <input
                placeholder="e.g. Pop"
                value={formData.genre}
                onChange={(e) =>
                  setFormData({ ...formData, genre: e.target.value })
                }
                onBlur={() => handleBlur("genre")}
                style={showError("genre") ? { borderColor: "var(--color-danger)" } : {}}
              />
              {showError("genre") && (
                <FieldError>{errors.genre}</FieldError>
              )}
              <QuickPillsRow>
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
              </QuickPillsRow>
            </FormGroup>

            <TwoColumnRow>
              <FormGroup>
                <label>Duration (mm:ss)</label>
                <input
                  placeholder="e.g. 3:50"
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
                  placeholder="e.g. 2016"
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
              <label>Cover Artwork Image URL</label>
              <input
                placeholder="e.g. https://images.unsplash.com/..."
                value={formData.coverArt || ""}
                onChange={(e) =>
                  setFormData({ ...formData, coverArt: e.target.value })
                }
              />
              <QuickPillsRow>
                {SAMPLE_COVERS.map((sample) => (
                  <Pill
                    type="button"
                    key={sample.label}
                    onClick={() => setFormData({ ...formData, coverArt: sample.url })}
                  >
                    {sample.label}
                  </Pill>
                ))}
              </QuickPillsRow>
            </FormGroup>

            <FormGroup>
              <label>Audio Stream / Preview URL (Optional)</label>
              <input
                placeholder="e.g. https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
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
            <Button
              type="submit"
              variant="primary"
              style={{ borderRadius: "20px", padding: "0.6rem 1.35rem", fontWeight: 700 }}
            >
              {initialData ? "Save Changes" : "+ Create Track"}
            </Button>
          </ModalActions>
        </form>
      </ModalContent>
    </Overlay>
  );
};