import React, { useState } from "react";
import styled from "@emotion/styled";
import { theme } from "../styles";
import { Statistics } from "../types";

const ChartGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.25rem;
  margin-top: 1rem;
`;

const ChartCard = styled.div`
  background: ${theme.colors.cardBg};
  border: 1px solid ${theme.colors.cardBorder};
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: ${theme.shadows.card};
  display: flex;
  flex-direction: column;
`;

const ChartTitle = styled.h4`
  margin: 0 0 1.25rem 0;
  color: ${theme.colors.textPrimary};
  font-size: 0.95rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

// Color palette tailored for dark theme visualization
const PALETTE = [
  "#38bdf8", // Sky blue
  "#818cf8", // Indigo
  "#c084fc", // Purple
  "#f472b6", // Pink
  "#fb923c", // Orange
  "#4ade80", // Emerald
  "#a3e635", // Lime
  "#2dd4bf", // Teal
  "#facc15", // Amber
];

// Donut Chart Components
const DonutContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  gap: 1rem;
  flex-wrap: wrap;
`;

const SvgContainer = styled.div`
  position: relative;
  width: 140px;
  height: 140px;
`;

const LegendList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  max-height: 140px;
  overflow-y: auto;
  min-width: 130px;
  padding-right: 0.25rem;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.8rem;
  gap: 0.5rem;
`;

const LegendColor = styled.div<{ color: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ color }) => color};
  flex-shrink: 0;
`;

const LegendLabel = styled.span`
  color: ${theme.colors.textSecondary};
  max-width: 90px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const LegendValue = styled.span`
  color: ${theme.colors.textPrimary};
  font-weight: 600;
`;

// Bar Chart Components
const BarList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const BarRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const BarMeta = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
`;

const BarTrack = styled.div`
  height: 8px;
  background: ${theme.colors.surface};
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid ${theme.colors.cardBorder};
`;

const BarFill = styled.div<{ pct: number; color: string }>`
  height: 100%;
  width: ${({ pct }) => Math.min(100, Math.max(4, pct))}%;
  background: ${({ color }) => color};
  border-radius: 4px;
  transition: width 0.4s ease;
`;

interface VisualChartsProps {
  statistics: Statistics;
}

export const VisualCharts: React.FC<VisualChartsProps> = ({ statistics }) => {
  const [hoveredGenre, setHoveredGenre] = useState<string | null>(null);

  const total = statistics.totalSongs || 1;
  const songsPerGenre = statistics.songsPerGenre || [];
  const songsPerArtist = statistics.songsPerArtist || [];
  const albumsPerArtist = statistics.albumsPerArtist || [];

  // Calculate SVG Donut Stroke Offsets
  let accumulatedAngle = 0;
  const radius = 50;
  const circumference = 2 * Math.PI * radius;

  const donutSlices = songsPerGenre.map((genre, i) => {
    const fraction = genre.count / total;
    const strokeDasharray = `${fraction * circumference} ${circumference}`;
    const strokeDashoffset = -accumulatedAngle * circumference;
    accumulatedAngle += fraction;
    return {
      name: genre._id || "Unknown",
      count: genre.count,
      pct: Math.round(fraction * 100),
      color: PALETTE[i % PALETTE.length],
      strokeDasharray,
      strokeDashoffset,
    };
  });

  const maxArtistCount = Math.max(...songsPerArtist.map((a) => a.count), 1);

  return (
    <ChartGrid>
      {/* 1. Genre Distribution Chart */}
      <ChartCard>
        <ChartTitle>
          <span>Genre Breakdown</span>
          <span style={{ fontSize: "0.75rem", color: theme.colors.textMuted }}>
            {songsPerGenre.length} genres
          </span>
        </ChartTitle>

        {songsPerGenre.length === 0 ? (
          <p style={{ color: theme.colors.textMuted, fontSize: "0.85rem" }}>No genres recorded.</p>
        ) : (
          <DonutContainer>
            <SvgContainer>
              <svg width="140" height="140" viewBox="0 0 140 140" style={{ transform: "rotate(-90deg)" }}>
                <circle
                  cx="70"
                  cy="70"
                  r={radius}
                  fill="transparent"
                  stroke={theme.colors.surface}
                  strokeWidth="18"
                />
                {donutSlices.map((slice) => (
                  <circle
                    key={slice.name}
                    cx="70"
                    cy="70"
                    r={radius}
                    fill="transparent"
                    stroke={slice.color}
                    strokeWidth="18"
                    strokeDasharray={slice.strokeDasharray}
                    strokeDashoffset={slice.strokeDashoffset}
                    opacity={hoveredGenre && hoveredGenre !== slice.name ? 0.4 : 1}
                    style={{ transition: "opacity 0.2s ease" }}
                  />
                ))}
              </svg>
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  textAlign: "center",
                  pointerEvents: "none",
                }}
              >
                <div style={{ fontSize: "1.25rem", fontWeight: 700, color: theme.colors.textPrimary }}>
                  {statistics.totalSongs}
                </div>
                <div style={{ fontSize: "0.65rem", color: theme.colors.textMuted }}>Songs</div>
              </div>
            </SvgContainer>

            <LegendList>
              {donutSlices.map((slice) => (
                <LegendItem
                  key={slice.name}
                  onMouseEnter={() => setHoveredGenre(slice.name)}
                  onMouseLeave={() => setHoveredGenre(null)}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <LegendColor color={slice.color} />
                    <LegendLabel title={slice.name}>{slice.name}</LegendLabel>
                  </div>
                  <LegendValue>{slice.pct}%</LegendValue>
                </LegendItem>
              ))}
            </LegendList>
          </DonutContainer>
        )}
      </ChartCard>

      {/* 2. Top Artists Bar Chart */}
      <ChartCard>
        <ChartTitle>
          <span>Top Artists Catalog</span>
          <span style={{ fontSize: "0.75rem", color: theme.colors.textMuted }}>
            {songsPerArtist.length} artists
          </span>
        </ChartTitle>

        {songsPerArtist.length === 0 ? (
          <p style={{ color: theme.colors.textMuted, fontSize: "0.85rem" }}>No artists recorded.</p>
        ) : (
          <BarList>
            {songsPerArtist.slice(0, 5).map((artist, idx) => {
              const pct = (artist.count / maxArtistCount) * 100;
              return (
                <BarRow key={artist._id || "unknown"}>
                  <BarMeta>
                    <span style={{ color: theme.colors.textPrimary, fontWeight: 500 }}>
                      {artist._id || "Unknown"}
                    </span>
                    <span style={{ color: theme.colors.textSecondary }}>
                      {artist.count} {artist.count === 1 ? "song" : "songs"}
                    </span>
                  </BarMeta>
                  <BarTrack>
                    <BarFill pct={pct} color={PALETTE[idx % PALETTE.length]} />
                  </BarTrack>
                </BarRow>
              );
            })}
          </BarList>
        )}
      </ChartCard>

      {/* 3. Albums by Artist */}
      <ChartCard>
        <ChartTitle>
          <span>Albums per Artist</span>
          <span style={{ fontSize: "0.75rem", color: theme.colors.textMuted }}>
            {albumsPerArtist.length} artists
          </span>
        </ChartTitle>

        {albumsPerArtist.length === 0 ? (
          <p style={{ color: theme.colors.textMuted, fontSize: "0.85rem" }}>No albums recorded.</p>
        ) : (
          <BarList>
            {albumsPerArtist.slice(0, 5).map((item, idx) => {
              const maxAlbum = Math.max(...albumsPerArtist.map((a) => a.count), 1);
              const pct = (item.count / maxAlbum) * 100;
              return (
                <BarRow key={item._id || "unknown"}>
                  <BarMeta>
                    <span style={{ color: theme.colors.textPrimary, fontWeight: 500 }}>
                      {item._id || "Unknown"}
                    </span>
                    <span style={{ color: theme.colors.textSecondary }}>
                      {item.count} {item.count === 1 ? "album" : "albums"}
                    </span>
                  </BarMeta>
                  <BarTrack>
                    <BarFill pct={pct} color={PALETTE[(idx + 3) % PALETTE.length]} />
                  </BarTrack>
                </BarRow>
              );
            })}
          </BarList>
        )}
      </ChartCard>
    </ChartGrid>
  );
};
