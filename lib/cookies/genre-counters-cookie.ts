export interface GenreCounter {
  [genre: string]: number;
}

const GENRE_COUNTERS_COOKIE = "genre_counters";
const COOKIE_EXPIRY_DAYS = 30;

/**
 * Get genre play counters from cookies
 */
export const getGenreCounters = (): GenreCounter => {
  if (typeof window === "undefined") return {};

  try {
    const cookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${GENRE_COUNTERS_COOKIE}=`));

    if (!cookie) return {};

    const value = cookie.split("=")[1];
    const decoded = decodeURIComponent(value);
    const counters: GenreCounter = JSON.parse(decoded);

    // Validate that all values are numbers
    const validCounters: GenreCounter = {};
    for (const [genre, count] of Object.entries(counters)) {
      if (typeof count === "number" && count >= 0) {
        validCounters[genre] = count;
      }
    }

    return validCounters;
  } catch (error) {
    console.error("Error parsing genre counters cookie:", error);
    return {};
  }
};

/**
 * Increment the counter for a specific genre
 */
export const incrementGenreCounter = (genre: string): void => {
  if (typeof window === "undefined" || !genre) return;

  try {
    const counters = getGenreCounters();
    counters[genre] = (counters[genre] || 0) + 1;

    // Set cookie
    const value = encodeURIComponent(JSON.stringify(counters));
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + COOKIE_EXPIRY_DAYS);

    document.cookie = `${GENRE_COUNTERS_COOKIE}=${value}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax`;
  } catch (error) {
    console.error("Error updating genre counters cookie:", error);
  }
};

/**
 * Get the top N genres by play count
 */
export const getTopGenres = (limit: number = 5): Array<{ genre: string; count: number }> => {
  const counters = getGenreCounters();

  return Object.entries(counters)
    .map(([genre, count]) => ({ genre, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
};

/**
 * Get total songs played across all genres
 */
export const getTotalSongsPlayed = (): number => {
  const counters = getGenreCounters();
  return Object.values(counters).reduce((total, count) => total + count, 0);
};

/**
 * Clear all genre counters
 */
export const clearGenreCounters = (): void => {
  if (typeof window === "undefined") return;

  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() - 1); // Set to past date to expire

  document.cookie = `${GENRE_COUNTERS_COOKIE}=; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax`;
};