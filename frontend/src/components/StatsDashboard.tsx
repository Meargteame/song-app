import React from "react";
import styled from "@emotion/styled";
import { theme } from "../styles";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setViewMode } from "../store/slices/songSlice";
import { VisualCharts } from "./VisualCharts";

const Section = styled.section`
  margin-bottom: 2rem;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const SectionTitle = styled.h3`
  font-size: 0.95rem;
  font-weight: 600;
  color: ${theme.colors.textSecondary};
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
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
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.25rem;
`;

const MetricCard = styled.div`
  background: ${theme.colors.cardBg};
  border: 1px solid ${theme.colors.cardBorder};
  border-radius: 10px;
  padding: 1.25rem;
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
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.35rem;
`;

const MetricValue = styled.span`
  font-size: 2rem;
  font-weight: 700;
  color: ${theme.colors.textPrimary};
  letter-spacing: -0.02em;
`;

const BreakdownsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
`;

const BreakdownCard = styled.div`
  background: ${theme.colors.cardBg};
  border: 1px solid ${theme.colors.cardBorder};
  border-radius: 10px;
  padding: 1.25rem;
  box-shadow: ${theme.shadows.card};
  transition: border-color 0.15s ease;

  &:hover {
    border-color: ${theme.colors.cardBorderHover};
  }
`;

const BreakdownCardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
`;

const BreakdownCardTitle = styled.h4`
  margin: 0;
  color: ${theme.colors.textMuted};
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const BreakdownContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  max-height: 130px;
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
  max-width: 140px;
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

const HeaderBadge = styled.span`
  font-size: 0.75rem;
  background: ${theme.colors.tagBg};
  color: ${theme.colors.tagText};
  border: 1px solid ${theme.colors.tagBorder};
  padding: 0.1rem 0.45rem;
  border-radius: 4px;
  font-weight: 600;
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
        <p style={{ color: theme.colors.textMuted, fontSize: "0.9rem" }}>Loading analytics...</p>
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
        <SectionTitle>Analytics</SectionTitle>
        <ViewToggle>
          <ToggleBtn
            active={viewMode === "cards"}
            onClick={() => dispatch(setViewMode("cards"))}
          >
            Cards
          </ToggleBtn>
          <ToggleBtn
            active={viewMode === "analytics"}
            onClick={() => dispatch(setViewMode("analytics"))}
          >
            Charts
          </ToggleBtn>
        </ViewToggle>
      </SectionHeader>

      {/* 4 Core Summary Stat Cards */}
      <KeyMetricsGrid>
        <MetricCard>
          <MetricTitle>Total Songs</MetricTitle>
          <MetricValue>{statistics.totalSongs || 0}</MetricValue>
        </MetricCard>

        <MetricCard>
          <MetricTitle>Total Artists</MetricTitle>
          <MetricValue>{totalArtists}</MetricValue>
        </MetricCard>

        <MetricCard>
          <MetricTitle>Total Albums</MetricTitle>
          <MetricValue>{totalAlbums}</MetricValue>
        </MetricCard>

        <MetricCard>
          <MetricTitle>Total Genres</MetricTitle>
          <MetricValue>{totalGenres}</MetricValue>
        </MetricCard>
      </KeyMetricsGrid>

      {viewMode === "analytics" ? (
        <VisualCharts statistics={statistics} />
      ) : (
        <BreakdownsGrid>
          {/* 1. Songs in Every Genre */}
          <BreakdownCard>
            <BreakdownCardHeader>
              <BreakdownCardTitle>Songs by Genre</BreakdownCardTitle>
              <HeaderBadge>{songsPerGenre.length}</HeaderBadge>
            </BreakdownCardHeader>
            <BreakdownContainer>
              {songsPerGenre.length === 0 ? (
                <EmptyNotice>No genres recorded</EmptyNotice>
              ) : (
                songsPerGenre.map((g) => (
                  <BreakdownItem key={g._id || "unknown"}>
                    <BreakdownLabel>{g._id || "Unknown"}</BreakdownLabel>
                    <BreakdownBadge>{g.count}</BreakdownBadge>
                  </BreakdownItem>
                ))
              )}
            </BreakdownContainer>
          </BreakdownCard>

          {/* 2. Songs per Artist */}
          <BreakdownCard>
            <BreakdownCardHeader>
              <BreakdownCardTitle>Songs by Artist</BreakdownCardTitle>
              <HeaderBadge>{songsPerArtist.length}</HeaderBadge>
            </BreakdownCardHeader>
            <BreakdownContainer>
              {songsPerArtist.length === 0 ? (
                <EmptyNotice>No artists recorded</EmptyNotice>
              ) : (
                songsPerArtist.map((a) => (
                  <BreakdownItem key={a._id || "unknown"}>
                    <BreakdownLabel>{a._id || "Unknown"}</BreakdownLabel>
                    <BreakdownBadge>{a.count}</BreakdownBadge>
                  </BreakdownItem>
                ))
              )}
            </BreakdownContainer>
          </BreakdownCard>

          {/* 3. Albums per Artist */}
          <BreakdownCard>
            <BreakdownCardHeader>
              <BreakdownCardTitle>Albums by Artist</BreakdownCardTitle>
              <HeaderBadge>{albumsPerArtist.length}</HeaderBadge>
            </BreakdownCardHeader>
            <BreakdownContainer>
              {albumsPerArtist.length === 0 ? (
                <EmptyNotice>No albums recorded</EmptyNotice>
              ) : (
                albumsPerArtist.map((item) => (
                  <BreakdownItem key={item._id || "unknown"}>
                    <BreakdownLabel>{item._id || "Unknown"}</BreakdownLabel>
                    <BreakdownBadge>{item.count}</BreakdownBadge>
                  </BreakdownItem>
                ))
              )}
            </BreakdownContainer>
          </BreakdownCard>

          {/* 4. Songs in Each Album */}
          <BreakdownCard>
            <BreakdownCardHeader>
              <BreakdownCardTitle>Songs in Each Album</BreakdownCardTitle>
              <HeaderBadge>{songsPerAlbum.length}</HeaderBadge>
            </BreakdownCardHeader>
            <BreakdownContainer>
              {songsPerAlbum.length === 0 ? (
                <EmptyNotice>No albums recorded</EmptyNotice>
              ) : (
                songsPerAlbum.map((item) => (
                  <BreakdownItem key={item._id || "unknown"}>
                    <BreakdownLabel>{item._id || "Unknown"}</BreakdownLabel>
                    <BreakdownBadge>{item.count}</BreakdownBadge>
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