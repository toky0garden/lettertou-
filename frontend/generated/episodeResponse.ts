import type { TranslationResponse } from '.';

export interface EpisodeResponse {
  id: number;
  title: string;
  iframe_url: string;
  seasons: number;
  translations: TranslationResponse[];
}
