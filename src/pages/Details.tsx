import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import styled from 'styled-components';
import { isInWatchlist, toggleWatchlist } from '../utils/watchlist';
import { fetchMovieDetails } from '../api/tmbd.ts';

const Container = styled.main`
  padding: 1rem;
  max-width: 900px;
  margin: 0 auto;
  color: white;
`;

const BackButton = styled.button`
  background: #e50914;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  margin-bottom: 1rem;

  &:hover {
    background: #b0070f;
  }
`;

const Header = styled.header`
  display: flex;
  align-items: flex-start;
  flex-direction: row;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const Poster = styled.img`
  width: 300px;
  border-radius: 8px;
  margin-right: 2rem;
  object-fit: cover;

  @media (max-width: 768px) {
    width: 100%;
    max-width: 250px;
    margin-right: 0;
    margin-bottom: 1rem;
  }
`;

const Info = styled.div`
  max-width: 550px;

  @media (max-width: 768px) {
    text-align: center;
    max-width: 100%;
  }
`;

const Title = styled.h1`
  margin: 0;
  font-size: 2rem;

  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

const Overview = styled.p`
  line-height: 1.4;
  margin-top: 1rem;

  @media (max-width: 768px) {
    margin: 1rem 4rem 0 4rem;
  }

  @media (max-width: 480px) {
    font-size: 0.9rem;
    margin: 1rem 0 0 0;
  }
`;

const Button = styled.button<{ active?: boolean }>`
  background: ${({ active }) => (active ? '#e50914' : '#444')};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  margin-top: 1rem;

  &:hover {
    background: ${({ active }) => (active ? '#b0070f' : '#666')};
  }
`;

const IMG_BASE = 'https://image.tmdb.org/t/p/w500';

const Details = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: movie, isLoading } = useQuery({
    queryKey: ['movie', id],
    queryFn: () => fetchMovieDetails(id!),
    enabled: !!id,
  });

  const [inWatchlist, setInWatchlist] = React.useState(false);

  React.useEffect(() => {
    if (id) {
      setInWatchlist(isInWatchlist(parseInt(id)));
    }
  }, [id]);

  const handleToggle = () => {
    if (id) {
      toggleWatchlist(parseInt(id));
      setInWatchlist(isInWatchlist(parseInt(id)));
    }
  };

  if (isLoading || !movie) {
    return <p>Loading...</p>;
  }

  return (
    <Container>
      <BackButton onClick={() => navigate(-1)} aria-label="Go back">
        ← Back
      </BackButton>
      <Header>
        {movie.poster_path ? (
          <Poster
            src={`${IMG_BASE}${movie.poster_path}`}
            alt={`${movie.title} poster`}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null; // Prevent infinite loop
              target.src = `${import.meta.env.BASE_URL}Movie-theatre-camera.jpg`;
            }}
          />
        ) : (
          <Poster
            src={`${import.meta.env.BASE_URL}Movie-theatre-camera.jpg`}
            aria-label="No poster available"
            loading="lazy"
          />
        )}
        <Info>
          <Title>{movie.title}</Title>
          <div>Release Date: {movie.release_date}</div>
          <div>Rating: ⭐ {movie.vote_average.toFixed(1)}</div>
          <div>
            Genres:
            {movie.genres
              ? ' ' +
                movie.genres.reduce(
                  (acc: string, item: { id: number; name: string }) =>
                    acc === '' ? item.name : acc + ', ' + item.name,
                  ''
                )
              : ''}
          </div>
          <Overview>{movie.overview}</Overview>
          <Button onClick={handleToggle} aria-pressed={inWatchlist}>
            {inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
          </Button>
        </Info>
      </Header>
    </Container>
  );
};

export default Details;
