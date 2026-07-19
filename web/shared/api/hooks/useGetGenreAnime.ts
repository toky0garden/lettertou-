import { useInfiniteQuery } from '@tanstack/react-query';
import { getGenreAnime } from '../request';

export const useGetGenreAnime = (slug: string, settings?: InfinityQuerySettings<typeof getGenreAnime>) =>
  useInfiniteQuery({
    queryKey: ['getGenreAnime', slug],
    queryFn: ({ pageParam }) =>
      getGenreAnime({
        params: { slug, next: pageParam as string | null },
        config: settings?.config
      }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.data.next_page ?? undefined,
    enabled: !!slug,
    ...settings?.options
  });
