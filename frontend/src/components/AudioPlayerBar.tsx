import React, { useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { theme } from "../styles";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  togglePlayPause,
  setVolume,
  playNext,
  playPrev,
  toggleFavoriteStart,
  setActiveLyricsSong,
} from "../store/slices/songSlice";
import { formatTime, parseDurationToSeconds } from "../utils/formatters";
import { getSongCover } from "../utils/coverArt";

const eqBounce = keyframes`
  0%, 100% { height: 4px; }
  50% { height: 18px; }
`;

const PlayerContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 90px;
  background: var(--player-bg);
  border-top: 1px solid ${theme.colors.cardBorder};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  z-index: 1000;
  box-shadow: ${theme.shadows.popover};
  box-sizing: border-box;

  @media (max-width: 768px) {
    height: 80px;
    padding: 0 1rem;
  }

  @media (max-width: 640px) {
    bottom: 60px;
    height: 64px;
    padding: 0 0.85rem;
    z-index: 1050;
    background: #181818;
    border-top: 1px solid rgba(255, 255, 255, 0.12);
  }
`;

const TrackInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.85rem;
  width: 25%;
  min-width: 180px;
`;

const CoverThumb = styled.img`
  width: 52px;
  height: 52px;
  border-radius: 6px;
  object-fit: cover;
  flex-shrink: 0;
  border: 1px solid ${theme.colors.cardBorder};
`;

const TrackMeta = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const TrackTitle = styled.div`
  font-size: 0.9rem;
  font-weight: 700;
  color: ${theme.colors.textPrimary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const TrackArtist = styled.div`
  font-size: 0.775rem;
  color: ${theme.colors.textSecondary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const HeartBtn = styled.button<{ isFav?: boolean }>`
  background: transparent;
  border: none;
  color: ${({ isFav }) => (isFav ? "#f43f5e" : theme.colors.textMuted)};
  cursor: pointer;
  padding: 0.25rem;
  margin-left: 0.25rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.15s ease;

  &:hover {
    color: #f43f5e;
    transform: scale(1.15);
  }

  svg {
    width: 18px;
    height: 18px;
    fill: ${({ isFav }) => (isFav ? "currentColor" : "none")};
    stroke: currentColor;
    stroke-width: 2;
  }
`;

const ControlsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
  flex: 1;
  max-width: 580px;
`;

const ButtonRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1.25rem;
`;

const ControlButton = styled.button<{ primary?: boolean; active?: boolean }>`
  background: ${({ primary }) => (primary ? "var(--music-accent)" : "transparent")};
  color: ${({ primary, active }) =>
    primary ? "#000000" : active ? "var(--music-accent)" : theme.colors.textSecondary};
  border: none;
  width: ${({ primary }) => (primary ? "38px" : "30px")};
  height: ${({ primary }) => (primary ? "38px" : "30px")};
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s cubic-bezier(0.34, 1.56, 0.64, 1);

  &:hover {
    color: ${({ primary }) => (primary ? "#000000" : theme.colors.textPrimary)};
    transform: scale(1.12);
    background: ${({ primary }) => (primary ? "var(--music-accent-hover)" : "transparent")};
  }

  &:active {
    transform: scale(0.95);
  }

  svg {
    width: ${({ primary }) => (primary ? "18px" : "16px")};
    height: ${({ primary }) => (primary ? "18px" : "16px")};
    fill: currentColor;
  }
`;

const ScrubberRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
`;

const TimeText = styled.span`
  font-size: 0.725rem;
  color: ${theme.colors.textMuted};
  font-variant-numeric: tabular-nums;
  min-width: 35px;
  text-align: center;
  font-weight: 500;
`;

const ProgressBar = styled.input`
  flex: 1;
  height: 4px;
  border-radius: 2px;
  background: ${theme.colors.cardBorder};
  appearance: none;
  cursor: pointer;
  outline: none;

  &::-webkit-slider-thumb {
    appearance: none;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: ${theme.colors.textPrimary};
    cursor: pointer;
    transition: transform 0.1s ease;
  }

  &:hover::-webkit-slider-thumb {
    transform: scale(1.3);
    background: var(--music-accent);
  }
`;

const RightControls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.85rem;
  width: 25%;
  min-width: 180px;
  justify-content: flex-end;

  @media (max-width: 640px) {
    display: none;
  }
`;

const Equalizer = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 3px;
  height: 18px;
  margin-right: 0.5rem;
`;

const EqBar = styled.div<{ active: boolean; delay: string }>`
  width: 3px;
  background: var(--music-accent);
  border-radius: 1px;
  height: ${({ active }) => (active ? "14px" : "4px")};
  animation: ${({ active }) => (active ? eqBounce : "none")} 0.8s ease-in-out infinite;
  animation-delay: ${({ delay }) => delay};
`;

const VolumeSlider = styled.input`
  width: 90px;
  height: 4px;
  border-radius: 2px;
  background: ${theme.colors.cardBorder};
  appearance: none;
  cursor: pointer;
  outline: none;

  &::-webkit-slider-thumb {
    appearance: none;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: ${theme.colors.textSecondary};
    cursor: pointer;
  }

  &:hover::-webkit-slider-thumb {
    background: var(--music-accent);
  }
`;

const IconButton = styled.button<{ active?: boolean }>`
  background: transparent;
  border: none;
  color: ${({ active }) => (active ? "var(--music-accent)" : theme.colors.textSecondary)};
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: ${theme.colors.textPrimary};
  }

  svg {
    width: 18px;
    height: 18px;
    fill: none;
    stroke: currentColor;
    stroke-width: 2;
  }
`;

export const AudioPlayerBar: React.FC = () => {
  const dispatch = useAppDispatch();
  const { currentSong, isPlaying, volume } = useAppSelector((state) => state.songs);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(180);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const synthTimerRef = useRef<number | null>(null);

  useEffect(() => {
    setDuration(parseDurationToSeconds(currentSong?.duration, 180));
    setCurrentTime(0);
  }, [currentSong]);

  useEffect(() => {
    if (!currentSong) return;

    if (currentSong.audioUrl) {
      if (!audioRef.current) {
        audioRef.current = new Audio();
      }
      if (audioRef.current.src !== currentSong.audioUrl) {
        audioRef.current.src = currentSong.audioUrl;
      }
      audioRef.current.volume = isMuted ? 0 : volume;

      if (isPlaying) {
        audioRef.current.play().catch(() => {});
      } else {
        audioRef.current.pause();
      }
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }
  }, [currentSong, isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (isPlaying) {
      synthTimerRef.current = window.setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            dispatch(playNext());
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (synthTimerRef.current) clearInterval(synthTimerRef.current);
    }

    return () => {
      if (synthTimerRef.current) clearInterval(synthTimerRef.current);
    };
  }, [isPlaying, duration, dispatch]);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setCurrentTime(val);
    if (audioRef.current && currentSong?.audioUrl) {
      audioRef.current.currentTime = val;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    dispatch(setVolume(val));
    if (val > 0) setIsMuted(false);
  };

  if (!currentSong) {
    return null;
  }

  const coverUrl = getSongCover(currentSong.title, currentSong.genre, currentSong.coverArt);

  return (
    <PlayerContainer>
      <TrackInfo>
        <CoverThumb src={coverUrl} alt={currentSong.title} />
        <TrackMeta>
          <TrackTitle title={currentSong.title}>{currentSong.title}</TrackTitle>
          <TrackArtist title={currentSong.artist}>{currentSong.artist}</TrackArtist>
        </TrackMeta>
        <HeartBtn
          isFav={currentSong.isFavorite}
          onClick={() => dispatch(toggleFavoriteStart(currentSong._id))}
          title={currentSong.isFavorite ? "Remove from Favorites" : "Add to Favorites"}
        >
          <svg viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </HeartBtn>
      </TrackInfo>

      <ControlsWrapper>
        <ButtonRow>
          <ControlButton
            active={isShuffle}
            onClick={() => setIsShuffle(!isShuffle)}
            title="Shuffle"
          >
            <svg viewBox="0 0 24 24">
              <path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.45 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z" />
            </svg>
          </ControlButton>

          <ControlButton onClick={() => dispatch(playPrev())} title="Previous">
            <svg viewBox="0 0 24 24">
              <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
            </svg>
          </ControlButton>

          <ControlButton
            primary
            onClick={() => dispatch(togglePlayPause())}
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <svg viewBox="0 0 24 24">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" style={{ marginLeft: "2px" }}>
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </ControlButton>

          <ControlButton onClick={() => dispatch(playNext())} title="Next">
            <svg viewBox="0 0 24 24">
              <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
            </svg>
          </ControlButton>

          <ControlButton
            active={isRepeat}
            onClick={() => setIsRepeat(!isRepeat)}
            title="Repeat"
          >
            <svg viewBox="0 0 24 24">
              <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z" />
            </svg>
          </ControlButton>
        </ButtonRow>

        <ScrubberRow>
          <TimeText>{formatTime(currentTime)}</TimeText>
          <ProgressBar
            type="range"
            min={0}
            max={duration}
            value={currentTime}
            onChange={handleSeek}
          />
          <TimeText>{formatTime(duration)}</TimeText>
        </ScrubberRow>
      </ControlsWrapper>

      <RightControls>
        {currentSong.lyrics && (
          <IconButton onClick={() => dispatch(setActiveLyricsSong(currentSong))} title="Lyrics">
            <svg viewBox="0 0 24 24">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
            </svg>
          </IconButton>
        )}

        <Equalizer title="Audio Visualizer">
          <EqBar active={isPlaying} delay="0s" />
          <EqBar active={isPlaying} delay="0.2s" />
          <EqBar active={isPlaying} delay="0.4s" />
          <EqBar active={isPlaying} delay="0.1s" />
        </Equalizer>

        <IconButton onClick={() => setIsMuted(!isMuted)} title={isMuted ? "Unmute" : "Mute"}>
          {isMuted || volume === 0 ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <line x1="1" y1="1" x2="23" y2="23"></line>
              <path d="M9 9v6a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            </svg>
          )}
        </IconButton>

        <VolumeSlider
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={isMuted ? 0 : volume}
          onChange={handleVolumeChange}
          title={`Volume: ${Math.round((isMuted ? 0 : volume) * 100)}%`}
        />
      </RightControls>
    </PlayerContainer>
  );
};
