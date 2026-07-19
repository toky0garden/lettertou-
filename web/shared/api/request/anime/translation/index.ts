import type { FetchesRequestConfig } from '@siberiacancode/fetches';
import type { TranslationResponseUrl } from '@/generated';
import { api } from '@/utils/api/instance';

export interface GetAnimeTranslationParams {
  shikiId: number;
  translationId: number;
}

export type GetAnimeTranslationRequestConfig = FetchesRequestConfig<GetAnimeTranslationParams>;

export const getAnimeTranslation = ({ config, params }: GetAnimeTranslationRequestConfig) =>
  api.get<TranslationResponseUrl[]>(
    `/translation?shiki_id=${params.shikiId}&translation_id=${params.translationId}`,
    config
  );
