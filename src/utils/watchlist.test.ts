import { getWatchlist, toggleWatchlist, isInWatchlist } from "./watchlist";

describe("Watchlist Utils", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should add a movie to the watchlist", () => {
    toggleWatchlist(1);
    expect(getWatchlist()).toContain(1);
    expect(isInWatchlist(1)).toBe(true);
  });

  it("should remove a movie from the watchlist", () => {
    toggleWatchlist(1);
    toggleWatchlist(1);
    expect(getWatchlist()).not.toContain(1);
    expect(isInWatchlist(1)).toBe(false);
  });
});
