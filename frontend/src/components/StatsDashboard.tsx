import React from "react";
import styled from "@emotion/styled";
import { theme } from "../styles";
import { useAppSelector } from "../store/hooks";

const Section = styled.section`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h3`
  font-size: 0.95rem;
  font-weight: 600;
  color: ${theme.colors.textSecondary};
  margin: 0 0 1rem 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
`;

const StatCard = styled.div`
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

const StatTitle = styled.h4`
  margin: 0 0 0.5rem 0;
  color: ${theme.colors.textMuted};
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${theme.colors.textPrimary};
  letter-spacing: -0.02em;
  margin-bottom: 0.25rem;
`;

const BreakdownContainer = styled.div`
  margin-top: 0.75rem;
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
  max-width: 150px;
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
  const { statistics, loading } = useAppSelector((state) => state.songs);

  if (loading && !statistics) {
    return (
      <Section>
        <SectionTitle>Analytics</SectionTitle>
        <p style={{ color: theme.colors.textMuted, fontSize: "0.9rem" }}>Loading analytics...</p>
      </Section>
    );
  }

  if (!statistics) {
    return null;
  }

  const songsPerGenre = statistics.songsPerGenre || [];
  const songsPerArtist = statistics.songsPerArtist || [];
  const albumsPerArtist = statistics.albumsPerArtist || [];

  return (
    <Section>
      <SectionTitle>Analytics</SectionTitle>
      <StatsGrid>
        <StatCard>
          <StatTitle>Total Songs</StatTitle>
          <StatValue>{statistics.totalSongs || 0}</StatValue>
          <span style={{ fontSize: "0.8rem", color: theme.colors.textMuted }}>
            Catalog count
          </span>
        </StatCard>

        <StatCard>
          <StatTitle>
            Songs by Genre
            <BreakdownBadge>{songsPerGenre.length}</BreakdownBadge>
          </StatTitle>
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
        </StatCard>

        <StatCard>
          <StatTitle>
            Songs by Artist
            <BreakdownBadge>{songsPerArtist.length}</BreakdownBadge>
          </StatTitle>
          <BreakdownContainer>
            {songsPerArtist.length === 0 ? (
              <EmptyNotice>No artists recorded</EmptyNotice>
            ) : (
              songsPerArtist.slice(0, 5).map((a) => (
                <BreakdownItem key={a._id || "unknown"}>
                  <BreakdownLabel>{a._id || "Unknown"}</BreakdownLabel>
                  <BreakdownBadge>{a.count}</BreakdownBadge>
                </BreakdownItem>
              ))
            )}
          </BreakdownContainer>
        </StatCard>

        <StatCard>
          <StatTitle>
            Albums by Artist
            <BreakdownBadge>{albumsPerArtist.length}</BreakdownBadge>
          </StatTitle>
          <BreakdownContainer>
            {albumsPerArtist.length === 0 ? (
              <EmptyNotice>No albums recorded</EmptyNotice>
            ) : (
              albumsPerArtist.slice(0, 5).map((item) => (
                <BreakdownItem key={item._id || "unknown"}>
                  <BreakdownLabel>{item._id || "Unknown"}</BreakdownLabel>
                  <BreakdownBadge>{item.count}</BreakdownBadge>
                </BreakdownItem>
              ))
            )}
          </BreakdownContainer>
        </StatCard>
      </StatsGrid>
    </Section>
  );
};