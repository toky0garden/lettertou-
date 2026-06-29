import type { SearchAnimeRequestConfig } from '../request/anime';
import { useMutation } from '@tanstack/react-query';
import { searchAnime } from '../request/anime';

export const useSearchAnime = (
  settings?: MutationSettings<SearchAnimeRequestConfig, typeof searchAnime>
) =>
  useMutation({
    mutationKey: ['searchAnime'],
    mutationFn: ({ params, config }) =>
      searchAnime({ params, config: { ...settings?.config, ...config } }),
    ...settings?.options
  });
