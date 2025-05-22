const WATCHLIST_KEY = 'movie_watchlist';

export const getWatchlist = (): number[] => {
  const stored = localStorage.getItem(WATCHLIST_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const toggleWatchlist = (id: number): number[] => {
  let list = getWatchlist();
  if (list.includes(id)) {
    list = list.filter((item) => item !== id);
  } else {
    list.push(id);
  }
  localStorage.setItem(WATCHLIST_KEY, JSON.stringify(list));
  return list;
};

export const isInWatchlist = (id: number): boolean => {
  return getWatchlist().includes(id);
};
