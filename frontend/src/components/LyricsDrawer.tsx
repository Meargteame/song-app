import React, { useState } from "react";
import styled from "@emotion/styled";
import { theme, Button } from "../styles";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setActiveLyricsSong } from "../store/slices/songSlice";

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

const DrawerContainer = styled.div`
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.cardBorderHover};
  border-radius: 12px;
  width: 100%;
  max-width: 580px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
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

const DrawerHeader = styled.div`
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid ${theme.colors.cardBorder};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const SongInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const HeaderTitle = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: ${theme.colors.textPrimary};
`;

const HeaderSubtitle = styled.span`
  font-size: 0.8rem;
  color: ${theme.colors.textSecondary};
  margin-top: 0.2rem;
`;

const LyricsBody = styled.div`
  padding: 1.5rem;
  overflow-y: auto;
  font-family: inherit;
  font-size: 0.95rem;
  line-height: 1.8;
  color: ${theme.colors.textPrimary};
  white-space: pre-wrap;
  background: #09090b;
  flex: 1;
`;

const EmptyLyrics = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: ${theme.colors.textMuted};
  font-size: 0.9rem;
`;

const DrawerFooter = styled.div`
  padding: 1rem 1.5rem;
  border-top: 1px solid ${theme.colors.cardBorder};
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${theme.colors.cardBg};
`;

export const LyricsDrawer: React.FC = () => {
  const dispatch = useAppDispatch();
  const activeLyricsSong = useAppSelector((state) => state.songs.activeLyricsSong);
  const [copied, setCopied] = useState(false);

  if (!activeLyricsSong) {
    return null;
  }

  const handleClose = () => {
    dispatch(setActiveLyricsSong(null));
  };

  const handleCopy = () => {
    if (activeLyricsSong.lyrics) {
      navigator.clipboard.writeText(activeLyricsSong.lyrics);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <Backdrop onClick={handleClose}>
      <DrawerContainer onClick={(e) => e.stopPropagation()}>
        <DrawerHeader>
          <SongInfo>
            <HeaderTitle>{activeLyricsSong.title}</HeaderTitle>
            <HeaderSubtitle>
              {activeLyricsSong.artist} • {activeLyricsSong.album} ({activeLyricsSong.genre})
            </HeaderSubtitle>
          </SongInfo>
          <Button variant="outline" size="sm" onClick={handleClose}>
            ✕
          </Button>
        </DrawerHeader>

        <LyricsBody>
          {activeLyricsSong.lyrics ? (
            activeLyricsSong.lyrics
          ) : (
            <EmptyLyrics>
              No lyrics added for this song yet.
            </EmptyLyrics>
          )}
        </LyricsBody>

        <DrawerFooter>
          {activeLyricsSong.lyrics ? (
            <Button variant="secondary" size="sm" onClick={handleCopy}>
              {copied ? "Copied" : "Copy Lyrics"}
            </Button>
          ) : (
            <div />
          )}
          <Button variant="primary" size="sm" onClick={handleClose}>
            Close
          </Button>
        </DrawerFooter>
      </DrawerContainer>
    </Backdrop>
  );
};
