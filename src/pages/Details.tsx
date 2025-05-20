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

const Poster = styled.img`
  width: 300px;
  border-radius: 8px;
  margin-right: 2rem;
  object-fit: cover;
`;

const Header = styled.header`
  display: flex;
  align-items: flex-start;
`;

const Info = styled.div`
  max-width: 550px;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 2rem;
`;

const Overview = styled.p`
  line-height: 1.4;
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
        {movie.poster_path && (
          <Poster
            src={`${IMG_BASE}${movie.poster_path}`}
            alt={`${movie.title} poster`}
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
