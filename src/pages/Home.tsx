import React, { useState, useMemo, useEffect } from 'react';
import styled from 'styled-components';
import { useQuery } from '@tanstack/react-query';
import debounce from 'lodash.debounce';
import { useSearchParams } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import SkeletonCard from '../components/SkeletonCard';
import { fetchMovies } from '../api/tmbd.ts';

const Container = styled.main`
  display: flex;
  flex-wrap: wrap;
  -webkit-box-pack: center;
  justify-content: center;
  padding: 1rem;
  max-width: 1200px;
  margin: 0 auto;
  flex-direction: column;
  align-items: center;
`;

const SearchInput = styled.input`
  width: 300px;
  padding: 0.75rem;
  font-size: 1.1rem;
  border-radius: 6px;
  border: none;
  margin: 0.5rem 0;
  outline-offset: 2px;
`;

const Grid = styled.section`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchTerm = searchParams.get('q') || ''; // from the URL

  const [inputValue, setInputValue] = useState(searchTerm); // local input value

  const debouncedUpdateQuery = useMemo(() => {
    return debounce((value: string) => {
      setSearchParams(value ? { q: value } : {}); // updates URL
    }, 300);
  }, [setSearchParams]);

  useEffect(() => {
    return () => {
      debouncedUpdateQuery.cancel(); // cleanup
    };
  }, [debouncedUpdateQuery]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value); // update input field immediately
    debouncedUpdateQuery(value); // update URL after debunce
  };

  const { data, isLoading } = useQuery({
    queryKey: ['movies', searchTerm],
    queryFn: () => fetchMovies(searchTerm),
    enabled: searchTerm.length > 0,
    staleTime: 1000 * 60 * 5,
  });

  return (
    <Container>
      <SearchInput
        id="search"
        type="search"
        placeholder="Search Movies..."
        aria-label="Search movies"
        value={inputValue}
        onChange={handleChange}
      />

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
