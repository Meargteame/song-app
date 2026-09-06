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
} from "../store/slices/songSlice";

const eqBounce = keyframes`
  0%, 100% { height: 4px; }
  50% { height: 16px; }
`;

const PlayerContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 80px;
  background: rgba(18, 18, 21, 0.96);
  backdrop-filter: blur(16px);
  border-top: 1px solid ${theme.colors.cardBorder};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  z-index: 1000;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.5);
  box-sizing: border-box;

  @media (max-width: 768px) {
    height: 70px;
    padding: 0 1rem;
  }
`;

const TrackInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.85rem;
  min-width: 200px;
  max-width: 28%;

  @media (max-width: 640px) {
    min-width: 140px;
  }
`;

const CoverThumb = styled.div<{ bg?: string }>`
  width: 48px;
  height: 48px;
  border-radius: 6px;
  background: ${({ bg }) => bg || "#27272a"};
  background-size: cover;
  background-position: center;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  border: 1px solid ${theme.colors.cardBorder};
`;

const TrackMeta = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const TrackTitle = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${theme.colors.textPrimary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const TrackArtist = styled.div`
  font-size: 0.75rem;
  color: ${theme.colors.textSecondary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ControlsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
  flex: 1;
  max-width: 520px;
`;

const ButtonRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ControlButton = styled.button<{ primary?: boolean }>`
  background: ${({ primary }) => (primary ? theme.colors.primary : "transparent")};
  color: ${({ primary }) => (primary ? theme.colors.primaryText : theme.colors.textSecondary)};
  border: none;
  width: ${({ primary }) => (primary ? "36px" : "28px")};
  height: ${({ primary }) => (primary ? "36px" : "28px")};
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ primary }) => (primary ? "1rem" : "0.9rem")};
  transition: all 0.15s ease;

  &:hover {
    color: ${({ primary }) => (primary ? theme.colors.primaryText : theme.colors.textPrimary)};
    transform: scale(1.08);
    background: ${({ primary }) => (primary ? theme.colors.primaryHover : "rgba(255,255,255,0.06)")};
  }

  &:active {
    transform: scale(0.95);
  }
`;

const ScrubberRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  width: 100%;
`;

const TimeText = styled.span`
  font-size: 0.7rem;
  color: ${theme.colors.textMuted};
  font-variant-numeric: tabular-nums;
  width: 32px;
  text-align: center;
`;

const ProgressBar = styled.input`
  flex: 1;
  height: 4px;
  border-radius: 2px;
  background: #27272a;
  appearance: none;
  cursor: pointer;
  outline: none;

  &::-webkit-slider-thumb {
    appearance: none;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: ${theme.colors.textPrimary};
    cursor: pointer;
    transition: transform 0.1s ease;
  }

  &:hover::-webkit-slider-thumb {
    transform: scale(1.3);
  }
`;

const RightControls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 160px;
  justify-content: flex-end;

  @media (max-width: 640px) {
    display: none;
  }
`;

const Equalizer = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 2px;
  height: 16px;
  margin-right: 0.5rem;
`;

const EqBar = styled.div<{ active: boolean; delay: string }>`
  width: 3px;
  background: #22c55e;
  border-radius: 1px;
  height: ${({ active }) => (active ? "12px" : "4px")};
  animation: ${({ active }) => (active ? eqBounce : "none")} 0.8s ease-in-out infinite;
  animation-delay: ${({ delay }) => delay};
`;

const VolumeSlider = styled.input`
  width: 80px;
  height: 4px;
  border-radius: 2px;
  background: #27272a;
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
`;

export const AudioPlayerBar: React.FC = () => {
  const dispatch = useAppDispatch();
  const { currentSong, isPlaying, volume } = useAppSelector((state) => state.songs);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(180); // default 3 min
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const synthTimerRef = useRef<number | null>(null);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Convert duration string "3:45" to seconds if available
  useEffect(() => {
    if (currentSong?.duration) {
      const parts = currentSong.duration.split(":");
      if (parts.length === 2) {
        const secs = parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
        if (!isNaN(secs) && secs > 0) setDuration(secs);
      }
    } else {
      setDuration(180);
    }
    setCurrentTime(0);
  }, [currentSong]);

  // Audio Playback handler (supports real audio URL with synthetic simulation fallback)
  useEffect(() => {
    if (!currentSong) return;

    if (currentSong.audioUrl) {
      if (!audioRef.current) {
        audioRef.current = new Audio();
      }
      audioRef.current.src = currentSong.audioUrl;
      audioRef.current.volume = volume;

      if (isPlaying) {
        audioRef.current.play().catch(() => {
          // fallback gracefully
        });
      } else {
        audioRef.current.pause();
      }
    } else {
      // Audio simulation ticker when playing synthesized song
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }
  }, [currentSong, isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Progress ticker
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
    dispatch(setVolume(Number(e.target.value)));
  };

  if (!currentSong) {
    return null;
  }

  return (
    <PlayerContainer>
      <TrackInfo>
        <CoverThumb bg={currentSong.coverArt ? `url("${currentSong.coverArt}")` : undefined}>
          {!currentSong.coverArt && "🎵"}
        </CoverThumb>
        <TrackMeta>
          <TrackTitle title={currentSong.title}>{currentSong.title}</TrackTitle>
          <TrackArtist title={`${currentSong.artist} • ${currentSong.album}`}>
            {currentSong.artist} • {currentSong.album}
          </TrackArtist>
        </TrackMeta>
      </TrackInfo>

      <ControlsWrapper>
        <ButtonRow>
          <ControlButton onClick={() => dispatch(playPrev())} title="Previous">
            ⏮
          </ControlButton>
          <ControlButton
            primary
            onClick={() => dispatch(togglePlayPause())}
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? "⏸" : "▶"}
          </ControlButton>
          <ControlButton onClick={() => dispatch(playNext())} title="Next">
            ⏭
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
        <Equalizer title="Audio Visualizer">
          <EqBar active={isPlaying} delay="0s" />
          <EqBar active={isPlaying} delay="0.2s" />
          <EqBar active={isPlaying} delay="0.4s" />
          <EqBar active={isPlaying} delay="0.1s" />
        </Equalizer>
        <span style={{ fontSize: "0.85rem", color: theme.colors.textMuted }}>🔊</span>
        <VolumeSlider
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={volume}
          onChange={handleVolumeChange}
          title={`Volume: ${Math.round(volume * 100)}%`}
        />
      </RightControls>
    </PlayerContainer>
  );
};
