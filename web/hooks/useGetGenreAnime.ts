import { useInfiniteQuery } from '@tanstack/react-query';
import { getGenreBySlugAnime } from '@/shared/api';
import type { GenreAnimeListSchema } from '@/shared/api/types.gen';

// The generated layer only exposes a plain query for this endpoint, but the grid
// needs cursor-based pagination (the API returns a `next_page` token), so wrap
// the request in an infinite query here.
export const useGetGenreAnime = (slug: string) =>
  useInfiniteQuery({
    queryKey: ['genreAnime', slug],
    initialPageParam: null as string | null,
    queryFn: ({ pageParam }) =>
      getGenreBySlugAnime({ path: { slug }, query: { next: pageParam } }),
    getNextPageParam: (lastPage) =>
      (lastPage.data as GenreAnimeListSchema).next_page ?? undefined
  });
