import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { isInWatchlist, toggleWatchlist } from '../utils/watchlist';
import type { Movie } from '../types';

const Card = styled.article`
  background: #282828;
  border-radius: 8px;
  overflow: hidden;
  color: #fff;
  display: flex;
  flex-direction: column;
  width: 200px;
  margin: 0.5rem;
  box-shadow: 0 0 8px #000;

  @media (max-width: 480px) {
    width: 300px;
    margin: 0.5rem 0;
  }
`;

const Poster = styled.img`
  width: 200px;
  height: 300px;
  object-fit: cover;
  background-color: #444;

  @media (max-width: 480px) {
    width: 100%;
    height: auto;
  }
`;

const Title = styled.h3`
  margin: 0.25rem 0;
  font-size: 1.1rem;

  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

const Button = styled.button<{ active?: boolean }>`
  background: ${({ active }) => (active ? '#e50914' : '#444')};
  color: white;
  border: none;
  padding: 0.5rem;
  border-radius: 4px;
  margin-top: auto;
  width: 100%;
  font-weight: bold;

  &:hover {
    background: ${({ active }) => (active ? '#b0070f' : '#666')};
  }

  @media (max-width: 470px) {
    font-size: 0.95rem;
    padding: 0.6rem;
  }
`;

const Info = styled.div`
  padding: 0.5rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

const Rating = styled.div`
  margin-bottom: 0.5rem;
`;

interface Props {
  movie: Movie;
}

const IMG_BASE = 'https://image.tmdb.org/t/p/w500';

const MovieCard = ({ movie }: Props) => {
  const [inWatchlist, setInWatchlist] = React.useState(isInWatchlist(movie.id));

  const handleToggle = () => {
    toggleWatchlist(movie.id);
    setInWatchlist(isInWatchlist(movie.id));
  };

  return (
    <Card aria-label={`Movie card for ${movie.title}`}>
      <Link to={`/details/${movie.id}`} tabIndex={-1}>
        {movie.poster_path ? (
          <Poster
            src={`${IMG_BASE}${movie.poster_path}`}
            alt={`Poster of ${movie.title}`}
            loading="lazy"
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
      </Link>
      <Info>
        <Title>{movie.title}</Title>
        <Rating>⭐ {movie.vote_average.toFixed(1)}</Rating>
        <Button onClick={handleToggle} aria-pressed={inWatchlist}>
          {inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
        </Button>
      </Info>
    </Card>
  );
};

export default MovieCard;
