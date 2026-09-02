import React from "react";
import styled from "@emotion/styled";
import { theme } from "../styles";
import { useAppSelector } from "../store/hooks";

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.25rem;
  margin-bottom: 2.5rem;
`;

const StatCard = styled.div`
  background: ${theme.colors.cardBg};
  border: 1px solid ${theme.colors.cardBorder};
  border-radius: 12px;
  padding: 1.25rem;
`;

const StatTitle = styled.h4`
  margin: 0 0 0.5rem 0;
  color: ${theme.colors.textSecondary};
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const StatValue = styled.div`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${theme.colors.textPrimary};
`;

const BreakdownList = styled.ul`
  margin: 0.75rem 0 0 0;
  padding-left: 1.2rem;
  font-size: 0.85rem;
  color: ${theme.colors.textSecondary};
`;

export const StatsDashboard: React.FC = () => {
  const { statistics, loading } = useAppSelector((state) => state.songs);

  if (loading && !statistics) {
    return <div>Loading analytics...</div>;
  }

  if (!statistics) {
    return null;
  }

  return (
    <StatsGrid>
      <StatCard>
        <StatTitle>Total Songs</StatTitle>
        <StatValue>{statistics.totalSongs}</StatValue>
      </StatCard>

      <StatCard>
        <StatTitle>Songs per Genre</StatTitle>
        <BreakdownList>
          {statistics.songsPerGenre.map((g) => (
            <li key={g._id}>
              {g._id || "Unknown"}: {g.count}
            </li>
          ))}
        </BreakdownList>
      </StatCard>

      <StatCard>
        <StatTitle>Songs per Artist</StatTitle>
        <BreakdownList>
          {statistics.songsPerArtist.slice(0, 4).map((a) => (
            <li key={a._id}>
              {a._id}: {a.count}
            </li>
          ))}
        </BreakdownList>
      </StatCard>

      <StatCard>
        <StatTitle>Albums per Artist</StatTitle>
        <BreakdownList>
          {statistics.albumsPerArtist.slice(0, 4).map((item) => (
            <li key={item._id}>
              {item._id}: {item.count}
            </li>
          ))}
        </BreakdownList>
      </StatCard>
    </StatsGrid>
  );
};