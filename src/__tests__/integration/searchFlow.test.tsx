import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import Home from '../../pages/Home';
import '@testing-library/jest-dom';

jest.mock('../../api/tmbd.ts', () => ({
  fetchMovies: jest.fn(() =>
    Promise.resolve([
      {
        id: 1,
        title: 'Test Movie',
        poster_path: null,
        release_date: '2020',
        vote_average: 8.5,
        overview: 'desc',
        genre_ids: [],
      },
    ])
  ),
}));

const setup = () => {
  const client = new QueryClient();
  render(
    <QueryClientProvider client={client}>
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    </QueryClientProvider>
  );
};

test('User can search and see results', async () => {
  setup();

  const input = screen.getByPlaceholderText(/search movies/i);
  fireEvent.change(input, { target: { value: 'Test' } });

  await waitFor(() => {
    expect(screen.getByText(/Test Movie/i)).toBeInTheDocument();
  });
});
