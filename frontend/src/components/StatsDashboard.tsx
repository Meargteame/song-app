import React from "react";
import styled from "@emotion/styled";
import { theme } from "../styles";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setViewMode } from "../store/slices/songSlice";
import { VisualCharts } from "./VisualCharts";

const Section = styled.section`
  margin-bottom: 2.25rem;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.15rem;
`;

const SectionTitle = styled.h3`
  font-size: 0.95rem;
  font-weight: 600;
  color: ${theme.colors.textSecondary};
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ViewToggle = styled.div`
  display: inline-flex;
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.cardBorder};
  border-radius: 6px;
  padding: 2px;
`;

const ToggleBtn = styled.button<{ active: boolean }>`
  background: ${({ active }) => (active ? "#27272a" : "transparent")};
  color: ${({ active }) => (active ? theme.colors.textPrimary : theme.colors.textMuted)};
  border: none;
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.25rem 0.65rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    color: ${theme.colors.textPrimary};
  }
`;

const KeyMetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 0.85rem;
  margin-bottom: 1.15rem;
`;

const MetricCard = styled.div`
  background: ${theme.colors.cardBg};
  border: 1px solid ${theme.colors.cardBorder};
  border-radius: 10px;
  padding: 1rem 1.15rem;
  box-shadow: ${theme.shadows.card};
  display: flex;
  flex-direction: column;
  transition: border-color 0.15s ease;

  &:hover {
    border-color: ${theme.colors.cardBorderHover};
  }
`;

const MetricTitle = styled.span`
  color: ${theme.colors.textMuted};
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.35rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const MetricValue = styled.span`
  font-size: 1.85rem;
  font-weight: 700;
  color: ${theme.colors.textPrimary};
  letter-spacing: -0.02em;
`;

const BreakdownsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1rem;
`;

const BreakdownCard = styled.div`
  background: ${theme.colors.cardBg};
  border: 1px solid ${theme.colors.cardBorder};
  border-radius: 10px;
  padding: 1.15rem;
  box-shadow: ${theme.shadows.card};
`;

const BreakdownCardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
`;

const BreakdownCardTitle = styled.h4`
  margin: 0;
  color: ${theme.colors.textPrimary};
  font-size: 0.85rem;
  font-weight: 600;
`;

const BreakdownContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  max-height: 140px;
  overflow-y: auto;
  padding-right: 0.25rem;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${theme.colors.secondaryBorder};
    border-radius: 4px;
  }
`;

const BreakdownItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.8rem;
  color: ${theme.colors.textSecondary};
  padding: 0.35rem 0.6rem;
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.cardBorder};
  border-radius: 6px;
`;

const BreakdownLabel = styled.span`
  font-weight: 500;
  color: ${theme.colors.textPrimary};
  max-width: 160px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const BreakdownBadge = styled.span`
  background: ${theme.colors.tagBg};
  color: ${theme.colors.tagText};
  font-weight: 600;
  font-size: 0.75rem;
  padding: 0.1rem 0.45rem;
  border-radius: 4px;
  border: 1px solid ${theme.colors.tagBorder};
`;

const EmptyNotice = styled.div`
  font-size: 0.8rem;
  color: ${theme.colors.textMuted};
  padding: 0.5rem 0;
`;

export const StatsDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { statistics, loading, viewMode } = useAppSelector((state) => state.songs);

  if (loading && !statistics) {
    return (
      <Section>
        <SectionHeader>
          <SectionTitle>Analytics</SectionTitle>
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
            Metrics & Cards
          </ToggleBtn>
          <ToggleBtn
            active={viewMode === "analytics"}
            onClick={() => dispatch(setViewMode("analytics"))}
          >
            Visual Charts
          </ToggleBtn>
        </ViewToggle>
      </SectionHeader>

      {/* 4 Core Summary Stat Cards */}
      <KeyMetricsGrid>
        <MetricCard>
          <MetricTitle>
            <span>Total Songs</span>
            <span>🎵</span>
          </MetricTitle>
          <MetricValue>{statistics.totalSongs || 0}</MetricValue>
        </MetricCard>

        <MetricCard>
          <MetricTitle>
            <span>Total Artists</span>
            <span>🎙️</span>
          </MetricTitle>
          <MetricValue>{totalArtists}</MetricValue>
        </MetricCard>

        <MetricCard>
          <MetricTitle>
            <span>Total Albums</span>
            <span>💿</span>
          </MetricTitle>
          <MetricValue>{totalAlbums}</MetricValue>
        </MetricCard>

        <MetricCard>
          <MetricTitle>
            <span>Total Genres</span>
            <span>🏷️</span>
          </MetricTitle>
          <MetricValue>{totalGenres}</MetricValue>
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
              <BreakdownBadge>{songsPerGenre.length} genres</BreakdownBadge>
            </BreakdownCardHeader>
            <BreakdownContainer>
              {songsPerGenre.length === 0 ? (
                <EmptyNotice>No genres recorded</EmptyNotice>
              ) : (
                songsPerGenre.map((g) => (
                  <BreakdownItem key={g._id || "unknown"}>
                    <BreakdownLabel>{g._id || "Unknown"}</BreakdownLabel>
                    <BreakdownBadge>{g.count} songs</BreakdownBadge>
                  </BreakdownItem>
                ))
              )}
            </BreakdownContainer>
          </BreakdownCard>

          {/* 2. # of Songs Each Artist Has */}
          <BreakdownCard>
            <BreakdownCardHeader>
              <BreakdownCardTitle>Songs per Artist</BreakdownCardTitle>
              <BreakdownBadge>{songsPerArtist.length} artists</BreakdownBadge>
            </BreakdownCardHeader>
            <BreakdownContainer>
              {songsPerArtist.length === 0 ? (
                <EmptyNotice>No artists recorded</EmptyNotice>
              ) : (
                songsPerArtist.map((a) => (
                  <BreakdownItem key={a._id || "unknown"}>
                    <BreakdownLabel>{a._id || "Unknown"}</BreakdownLabel>
                    <BreakdownBadge>{a.count} songs</BreakdownBadge>
                  </BreakdownItem>
                ))
              )}
            </BreakdownContainer>
          </BreakdownCard>

          {/* 3. # of Albums Each Artist Has */}
          <BreakdownCard>
            <BreakdownCardHeader>
              <BreakdownCardTitle>Albums per Artist</BreakdownCardTitle>
              <BreakdownBadge>{albumsPerArtist.length} artists</BreakdownBadge>
            </BreakdownCardHeader>
            <BreakdownContainer>
              {albumsPerArtist.length === 0 ? (
                <EmptyNotice>No albums recorded</EmptyNotice>
              ) : (
                albumsPerArtist.map((item) => (
                  <BreakdownItem key={item._id || "unknown"}>
                    <BreakdownLabel>{item._id || "Unknown"}</BreakdownLabel>
                    <BreakdownBadge>{item.count} albums</BreakdownBadge>
                  </BreakdownItem>
                ))
              )}
            </BreakdownContainer>
          </BreakdownCard>

          {/* 4. # of Songs in Each Album */}
          <BreakdownCard>
            <BreakdownCardHeader>
              <BreakdownCardTitle>Songs in Each Album</BreakdownCardTitle>
              <BreakdownBadge>{songsPerAlbum.length} albums</BreakdownBadge>
            </BreakdownCardHeader>
            <BreakdownContainer>
              {songsPerAlbum.length === 0 ? (
                <EmptyNotice>No albums recorded</EmptyNotice>
              ) : (
                songsPerAlbum.map((item) => (
                  <BreakdownItem key={item._id || "unknown"}>
                    <BreakdownLabel>{item._id || "Unknown"}</BreakdownLabel>
                    <BreakdownBadge>{item.count} songs</BreakdownBadge>
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