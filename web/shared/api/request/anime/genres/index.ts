import type { FetchesRequestConfig } from '@siberiacancode/fetches';
import type { GenreAnimeListResponse, GenreResponse } from '@/generated';
import { api } from '@/utils/api/instance';

export const getGenres = ({ config }: RequestConfig = {}) =>
  api.get<GenreResponse[]>('/genres', config);

export interface GetGenreAnimeParams {
  slug: string;
  next?: string | null;
}

export type GetGenreAnimeRequestConfig = FetchesRequestConfig<GetGenreAnimeParams>;

export const getGenreAnime = ({ config, params }: GetGenreAnimeRequestConfig) =>
  api.get<GenreAnimeListResponse>(
    `/genres/${encodeURIComponent(params.slug)}/anime${
      params.next ? `?next=${encodeURIComponent(params.next)}` : ''
    }`,
    config
  );
