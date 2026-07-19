import type { FetchesRequestConfig } from '@siberiacancode/fetches';
import type { PlayerResponse } from '@/generated';
import { api } from '@/utils/api/instance';

export interface GetAnimePlayerParams {
  slug: string;
}

export type GetAnimePlayerRequestConfig = FetchesRequestConfig<GetAnimePlayerParams>;

export const getAnimePlayer = ({ config, params }: GetAnimePlayerRequestConfig) =>
  api.get<PlayerResponse>(`/title/player?slug=${encodeURIComponent(params.slug)}`, config);
