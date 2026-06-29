import type { FetchesRequestConfig } from '@siberiacancode/fetches';
import type { AnimeResponse } from '@/generated';
import { api } from '@/utils/api/instance';

export interface GetAnimeParams {
  slug: string;
}

export type GetAnimeRequestConfig = FetchesRequestConfig<GetAnimeParams>;

export const getAnime = ({ config, params }: GetAnimeRequestConfig) =>
  api.get<AnimeResponse>(`/title/${params.slug}`, config);
