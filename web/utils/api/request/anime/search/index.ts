import type { FetchesRequestConfig } from '@siberiacancode/fetches';
import type { AnimeResponse } from '@/generated';
import { api } from '@/utils/api/instance';

export interface SearchAnimeParams {
  search: string;
  limit?: number;
}

export type SearchAnimeRequestConfig = FetchesRequestConfig<SearchAnimeParams>;

export const searchAnime = ({ config, params }: SearchAnimeRequestConfig) => {
  const query = new URLSearchParams({
    search: params.search,
    limit: String(params.limit || 5)
  });

  return api.get<AnimeResponse[]>(`/short-search/?${query.toString()}`, config);
};
