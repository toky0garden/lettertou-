import type { FetchesRequestConfig } from '@siberiacancode/fetches';
import type { AnimeResponse } from '@/generated';
import { api } from '@/utils/api/instance';

export interface SearchAnimeParams {
  search: string;
  limit?: number;
}

export type SearchAnimeRequestConfig = FetchesRequestConfig<SearchAnimeParams>;

export const searchAnime = ({ config, params }: SearchAnimeRequestConfig) =>
  api.get<AnimeResponse[]>(
    `/short-search/?search=${params.search}&limit=${params.limit || 5}`,
    { ...params, ...config }
  );
