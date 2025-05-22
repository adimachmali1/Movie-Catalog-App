import React, { useState, useMemo, useEffect } from 'react';
import styled from 'styled-components';
import { useQuery } from '@tanstack/react-query';
import debounce from 'lodash.debounce';
import { useSearchParams } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import SkeletonCard from '../components/SkeletonCard';
import { fetchMovies } from '../api/tmbd.ts';

const Header = styled.header`
  position: fixed;
  top: 0;
  width: 100%;
  background-color: #111;
  z-index: 1000;
  padding: 1rem;
  display: flex;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
`;

const Container = styled.main`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding: 6rem 1rem 1rem;
  max-width: 1200px;
  margin: 0 auto;
  flex-direction: column;
  align-items: center;
`;

const SearchInput = styled.input`
  width: 100%;
  max-width: 300px;
  padding: 0.75rem;
  font-size: 1.1rem;
  border-radius: 6px;
  border: none;
  outline-offset: 2px;
`;

const Grid = styled.section`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchTerm = searchParams.get('q') || '';

  const [inputValue, setInputValue] = useState(searchTerm);

  const debouncedUpdateQuery = useMemo(() => {
    return debounce((value: string) => {
      setSearchParams(value ? { q: value } : {});
    }, 300);
  }, [setSearchParams]);

  useEffect(() => {
    return () => {
      debouncedUpdateQuery.cancel();
    };
  }, [debouncedUpdateQuery]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    debouncedUpdateQuery(value);
  };

  const { data, isLoading } = useQuery({
    queryKey: ['movies', searchTerm],
    queryFn: () => fetchMovies(searchTerm),
    enabled: searchTerm.length > 0,
    staleTime: 1000 * 60 * 5,
  });

  return (
    <Container>
      <Header>
        <SearchInput
          id="search"
          type="search"
          placeholder="Search Movies..."
          aria-label="Search movies"
          value={inputValue}
          onChange={handleChange}
        />
      </Header>

      <Grid>
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
          : data?.length
            ? data.map((movie) => <MovieCard key={movie.id} movie={movie} />)
            : searchTerm.length > 0 && <p>No results found.</p>}
      </Grid>
    </Container>
  );
};

export default Home;
