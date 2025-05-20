import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Home from "../../pages/Home";

const client = new QueryClient();

jest.mock("../../api/tmdb", () => ({
  fetchMovies: jest.fn(() =>
    Promise.resolve([
      {
        id: 1,
        title: "Test Movie",
        poster_path: null,
        release_date: "2020",
        vote_average: 8.5,
        overview: "desc",
        genre_ids: [],
      },
    ]),
  ),
}));

test("User can search and see results", async () => {
  render(
    <QueryClientProvider client={client}>
      <Home />
    </QueryClientProvider>,
  );

  fireEvent.change(screen.getByPlaceholderText(/search/i), {
    target: { value: "Test" },
  });

  await waitFor(() => screen.getByText(/Test Movie/i));
  expect(screen.getByText(/Test Movie/i)).toBeInTheDocument();
});
