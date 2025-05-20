import axios from "axios";
import type { Movie } from "../types";

const API_KEY = "d3ffb2edab382ca4611b76c674f93687";
const BASE_URL = "https://api.themoviedb.org/3";

export const fetchMovies = async (query: string): Promise<Movie[]> => {
  if (!query) return [];
  const { data } = await axios.get(`${BASE_URL}/search/movie`, {
    params: {
      api_key: API_KEY,
      query,
      include_adult: false,
    },
  });
  return data.results;
};

export const fetchMovieDetails = async (id: string): Promise<Movie> => {
  const { data } = await axios.get(`${BASE_URL}/movie/${id}`, {
    params: { api_key: API_KEY },
  });
  return data;
};
