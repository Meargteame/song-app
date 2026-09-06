import React from "react";
import styled from "@emotion/styled";
import { theme, Button } from "../styles";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { playSong } from "../store/slices/songSlice";
import { SongCard } from "./SongCard";
import { Song } from "../types";

const HomeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.25rem;
`;

const GreetingHero = styled.div`
  background: linear-gradient(135deg, rgba(29, 185, 84, 0.2) 0%, rgba(24, 24, 24, 0.9) 100%);
  border: 1px solid ${theme.colors.cardBorder};
  border-radius: 16px;
  padding: 2.25rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.5rem;
  box-shadow: ${theme.shadows.card};
`;

const GreetingTitle = styled.h1`
  font-size: 2.1rem;
  font-weight: 800;
  margin: 0 0 0.4rem 0;
  color: ${theme.colors.textPrimary};
  letter-spacing: -0.03em;
`;

const GreetingSub = styled.p`
  margin: 0;
  font-size: 0.95rem;
  color: ${theme.colors.textSecondary};
`;

const SectionContainer = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
  color: ${theme.colors.textPrimary};
  letter-spacing: -0.02em;
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1.25rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const EmptyNotice = styled.div`
  background: ${theme.colors.cardBg};
  border: 1px dashed ${theme.colors.cardBorder};
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  color: ${theme.colors.textMuted};
  font-size: 0.9rem;
`;

interface HomePageProps {
  onEdit: (song: Song) => void;
  onDelete: (id: string) => void;
  onViewDetails: (song: Song) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onEdit, onDelete, onViewDetails }) => {
  const dispatch = useAppDispatch();
  const { songs, recentlyPlayed } = useAppSelector((state) => state.songs);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const popularSongs = songs.slice(0, 4);
  const newReleases = [...songs].reverse().slice(0, 4);

  return (
    <HomeWrapper>
      <GreetingHero>
        <div>
          <GreetingTitle>{getGreeting()}</GreetingTitle>
          <GreetingSub>Discover top tracks, personalized picks, and your recent music history.</GreetingSub>
        </div>
        {songs.length > 0 && (
          <Button
            variant="primary"
            onClick={() => dispatch(playSong(songs[0]))}
            style={{ borderRadius: "24px", padding: "0.7rem 1.6rem", fontWeight: 700, fontSize: "0.95rem" }}
          >
            <svg viewBox="0 0 24 24" style={{ width: "18px", height: "18px", fill: "currentColor", marginRight: "0.4rem" }}>
              <path d="M8 5v14l11-7z" />
            </svg>
            Play Top Picks
          </Button>
        )}
      </GreetingHero>

      {/* Recently Played */}
      <SectionContainer>
        <SectionHeader>
          <SectionTitle>Recently Played</SectionTitle>
        </SectionHeader>

        {recentlyPlayed.length === 0 ? (
          <EmptyNotice>No recently played tracks yet. Play a track from your library to build your history!</EmptyNotice>
        ) : (
          <CardsGrid>
            {recentlyPlayed.slice(0, 4).map((song) => (
              <SongCard
                key={`rec-${song._id}`}
                song={song}
                onEdit={onEdit}
                onDelete={onDelete}
                onViewDetails={onViewDetails}
              />
            ))}
          </CardsGrid>
        )}
      </SectionContainer>

      {/* Popular Songs */}
      <SectionContainer>
        <SectionHeader>
          <SectionTitle>Popular Tracks</SectionTitle>
        </SectionHeader>

        <CardsGrid>
          {popularSongs.map((song) => (
            <SongCard
              key={`pop-${song._id}`}
              song={song}
              onEdit={onEdit}
              onDelete={onDelete}
              onViewDetails={onViewDetails}
            />
          ))}
        </CardsGrid>
      </SectionContainer>

      {/* New Releases */}
      <SectionContainer>
        <SectionHeader>
          <SectionTitle>New Releases</SectionTitle>
        </SectionHeader>

        <CardsGrid>
          {newReleases.map((song) => (
            <SongCard
              key={`new-${song._id}`}
              song={song}
              onEdit={onEdit}
              onDelete={onDelete}
              onViewDetails={onViewDetails}
            />
          ))}
        </CardsGrid>
      </SectionContainer>
    </HomeWrapper>
  );
};
