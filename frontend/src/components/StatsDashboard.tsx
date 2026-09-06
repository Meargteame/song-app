import React from "react";
import styled from "@emotion/styled";
import { theme } from "../styles";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setViewMode } from "../store/slices/songSlice";
import { VisualCharts } from "./VisualCharts";

const Section = styled.section`
  margin-bottom: 2.5rem;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
  flex-wrap: wrap;
  gap: 0.75rem;
`;

const SectionTitle = styled.h3`
  font-family: ${theme.fonts.heading};
  font-size: 1.15rem;
  font-weight: 700;
  color: ${theme.colors.textPrimary};
  margin: 0;
  letter-spacing: -0.01em;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ViewToggle = styled.div`
  display: inline-flex;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding: 3px;
  backdrop-filter: blur(8px);
`;

const ToggleBtn = styled.button<{ active: boolean }>`
  background: ${({ active }) =>
    active ? "rgba(255, 255, 255, 0.12)" : "transparent"};
  color: ${({ active }) => (active ? "#ffffff" : theme.colors.textMuted)};
  border: none;
  font-size: 0.78rem;
  font-weight: 600;
  padding: 0.35rem 0.85rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: ${theme.fonts.body};
  box-shadow: ${({ active }) =>
    active ? "0 2px 8px rgba(0,0,0,0.3)" : "none"};

  &:hover {
    color: #ffffff;
  }
`;

const KeyMetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const MetricCard = styled.div<{ glowColor: string; iconBg: string }>`
  background: ${theme.colors.cardBg};
  border: 1px solid ${theme.colors.cardBorder};
  border-radius: 14px;
  padding: 1.25rem;
  box-shadow: ${theme.shadows.card};
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(12px);
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${({ glowColor }) => glowColor};
    opacity: 0.8;
  }

  &:hover {
    border-color: rgba(255, 255, 255, 0.18);
    transform: translateY(-2px);
    box-shadow: 0 12px 25px -5px ${({ glowColor }) => glowColor}33, ${theme.shadows.card};
  }
`;

const MetricHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.6rem;
`;

const MetricTitle = styled.span`
  color: ${theme.colors.textSecondary};
  font-size: 0.78rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const MetricIcon = styled.div<{ bg: string }>`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: ${({ bg }) => bg};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
`;

const MetricValue = styled.span`
  font-family: ${theme.fonts.heading};
  font-size: 2.2rem;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: -0.03em;
  line-height: 1.1;
`;

const MetricFootnote = styled.span`
  font-size: 0.72rem;
  color: ${theme.colors.textMuted};
  margin-top: 0.35rem;
`;

const BreakdownsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(270px, 1fr));
  gap: 1.15rem;
`;

const BreakdownCard = styled.div`
  background: ${theme.colors.cardBg};
  border: 1px solid ${theme.colors.cardBorder};
  border-radius: 14px;
  padding: 1.25rem;
  box-shadow: ${theme.shadows.card};
  backdrop-filter: blur(12px);
  transition: border-color 0.2s ease;

  &:hover {
    border-color: rgba(255, 255, 255, 0.14);
  }
`;

const BreakdownCardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.9rem;
`;

const BreakdownCardTitle = styled.h4`
  margin: 0;
  color: ${theme.colors.textPrimary};
  font-size: 0.88rem;
  font-weight: 700;
  font-family: ${theme.fonts.heading};
`;

const BreakdownContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  max-height: 160px;
  overflow-y: auto;
  padding-right: 0.25rem;
`;

const BreakdownItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.82rem;
  color: ${theme.colors.textSecondary};
  padding: 0.45rem 0.75rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  transition: background 0.15s ease, border-color 0.15s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.06);
    border-color: rgba(255, 255, 255, 0.1);
  }
`;

const BreakdownLabel = styled.span`
  font-weight: 600;
  color: #f4f4f5;
  max-width: 160px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const BreakdownBadge = styled.span<{ color?: string }>`
  background: ${({ color }) => color || "rgba(139, 92, 246, 0.15)"};
  color: #fafafa;
  font-weight: 700;
  font-size: 0.75rem;
  padding: 0.15rem 0.55rem;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const HeaderBadge = styled.span`
  font-size: 0.72rem;
  font-weight: 600;
  color: ${theme.colors.textMuted};
  background: rgba(255, 255, 255, 0.04);
  padding: 0.15rem 0.5rem;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.06);
`;

const EmptyNotice = styled.div`
  font-size: 0.8rem;
  color: ${theme.colors.textMuted};
  padding: 1rem 0;
  text-align: center;
`;

export const StatsDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { statistics, loading, viewMode } = useAppSelector((state) => state.songs);

  if (loading && !statistics) {
    return (
      <Section>
        <SectionHeader>
          <SectionTitle>📊 Catalog Analytics</SectionTitle>
        </SectionHeader>
        <p style={{ color: theme.colors.textMuted, fontSize: "0.9rem" }}>Loading catalog metrics...</p>
      </Section>
    );
  }

  if (!statistics) {
    return null;
  }

  const songsPerGenre = statistics.songsPerGenre || [];
  const songsPerArtist = statistics.songsPerArtist || [];
  const songsPerAlbum = statistics.songsPerAlbum || [];
  const albumsPerArtist = statistics.albumsPerArtist || [];

  const totalArtists = statistics.totalArtists ?? songsPerArtist.length;
  const totalAlbums = statistics.totalAlbums ?? songsPerAlbum.length;
  const totalGenres = statistics.totalGenres ?? songsPerGenre.length;

  return (
    <Section>
      <SectionHeader>
        <SectionTitle>
          <span>📊</span> Catalog Overview & Statistics
        </SectionTitle>
        <ViewToggle>
          <ToggleBtn
            active={viewMode === "cards"}
            onClick={() => dispatch(setViewMode("cards"))}
          >
            Metrics & Breakdowns
          </ToggleBtn>
          <ToggleBtn
            active={viewMode === "analytics"}
            onClick={() => dispatch(setViewMode("analytics"))}
          >
            Interactive Charts
          </ToggleBtn>
        </ViewToggle>
      </SectionHeader>

      {/* 4 Glowing Hero Metric Cards */}
      <KeyMetricsGrid>
        <MetricCard glowColor="#a855f7" iconBg="rgba(168, 85, 247, 0.15)">
          <MetricHeader>
            <MetricTitle>Total Songs</MetricTitle>
            <MetricIcon bg="rgba(168, 85, 247, 0.2)">🎵</MetricIcon>
          </MetricHeader>
          <MetricValue>{statistics.totalSongs || 0}</MetricValue>
          <MetricFootnote>Track catalog count</MetricFootnote>
        </MetricCard>

        <MetricCard glowColor="#38bdf8" iconBg="rgba(56, 189, 248, 0.15)">
          <MetricHeader>
            <MetricTitle>Unique Artists</MetricTitle>
            <MetricIcon bg="rgba(56, 189, 248, 0.2)">🎙️</MetricIcon>
          </MetricHeader>
          <MetricValue>{totalArtists}</MetricValue>
          <MetricFootnote>Recording creators</MetricFootnote>
        </MetricCard>

        <MetricCard glowColor="#34d399" iconBg="rgba(52, 211, 153, 0.15)">
          <MetricHeader>
            <MetricTitle>Total Albums</MetricTitle>
            <MetricIcon bg="rgba(52, 211, 153, 0.2)">💿</MetricIcon>
          </MetricHeader>
          <MetricValue>{totalAlbums}</MetricValue>
          <MetricFootnote>Distinct releases</MetricFootnote>
        </MetricCard>

        <MetricCard glowColor="#fb923c" iconBg="rgba(251, 146, 60, 0.15)">
          <MetricHeader>
            <MetricTitle>Total Genres</MetricTitle>
            <MetricIcon bg="rgba(251, 146, 60, 0.2)">🏷️</MetricIcon>
          </MetricHeader>
          <MetricValue>{totalGenres}</MetricValue>
          <MetricFootnote>Music classifications</MetricFootnote>
        </MetricCard>
      </KeyMetricsGrid>

      {viewMode === "analytics" ? (
        <VisualCharts statistics={statistics} />
      ) : (
        <BreakdownsGrid>
          {/* 1. # of Songs in Every Genre */}
          <BreakdownCard>
            <BreakdownCardHeader>
              <BreakdownCardTitle>Songs in Every Genre</BreakdownCardTitle>
              <HeaderBadge>{songsPerGenre.length} genres</HeaderBadge>
            </BreakdownCardHeader>
            <BreakdownContainer>
              {songsPerGenre.length === 0 ? (
                <EmptyNotice>No genres recorded</EmptyNotice>
              ) : (
                songsPerGenre.map((g) => (
                  <BreakdownItem key={g._id || "unknown"}>
                    <BreakdownLabel>{g._id || "Unknown"}</BreakdownLabel>
                    <BreakdownBadge color="rgba(168, 85, 247, 0.25)">{g.count} songs</BreakdownBadge>
                  </BreakdownItem>
                ))
              )}
            </BreakdownContainer>
          </BreakdownCard>

          {/* 2. # of Songs Each Artist Has */}
          <BreakdownCard>
            <BreakdownCardHeader>
              <BreakdownCardTitle>Songs per Artist</BreakdownCardTitle>
              <HeaderBadge>{songsPerArtist.length} artists</HeaderBadge>
            </BreakdownCardHeader>
            <BreakdownContainer>
              {songsPerArtist.length === 0 ? (
                <EmptyNotice>No artists recorded</EmptyNotice>
              ) : (
                songsPerArtist.map((a) => (
                  <BreakdownItem key={a._id || "unknown"}>
                    <BreakdownLabel>{a._id || "Unknown"}</BreakdownLabel>
                    <BreakdownBadge color="rgba(56, 189, 248, 0.25)">{a.count} songs</BreakdownBadge>
                  </BreakdownItem>
                ))
              )}
            </BreakdownContainer>
          </BreakdownCard>

          {/* 3. # of Albums Each Artist Has */}
          <BreakdownCard>
            <BreakdownCardHeader>
              <BreakdownCardTitle>Albums per Artist</BreakdownCardTitle>
              <HeaderBadge>{albumsPerArtist.length} artists</HeaderBadge>
            </BreakdownCardHeader>
            <BreakdownContainer>
              {albumsPerArtist.length === 0 ? (
                <EmptyNotice>No albums recorded</EmptyNotice>
              ) : (
                albumsPerArtist.map((item) => (
                  <BreakdownItem key={item._id || "unknown"}>
                    <BreakdownLabel>{item._id || "Unknown"}</BreakdownLabel>
                    <BreakdownBadge color="rgba(52, 211, 153, 0.25)">{item.count} albums</BreakdownBadge>
                  </BreakdownItem>
                ))
              )}
            </BreakdownContainer>
          </BreakdownCard>

          {/* 4. # of Songs in Each Album */}
          <BreakdownCard>
            <BreakdownCardHeader>
              <BreakdownCardTitle>Songs in Each Album</BreakdownCardTitle>
              <HeaderBadge>{songsPerAlbum.length} albums</HeaderBadge>
            </BreakdownCardHeader>
            <BreakdownContainer>
              {songsPerAlbum.length === 0 ? (
                <EmptyNotice>No albums recorded</EmptyNotice>
              ) : (
                songsPerAlbum.map((item) => (
                  <BreakdownItem key={item._id || "unknown"}>
                    <BreakdownLabel>{item._id || "Unknown"}</BreakdownLabel>
                    <BreakdownBadge color="rgba(251, 146, 60, 0.25)">{item.count} songs</BreakdownBadge>
                  </BreakdownItem>
                ))
              )}
            </BreakdownContainer>
          </BreakdownCard>
        </BreakdownsGrid>
      )}
    </Section>
  );
};