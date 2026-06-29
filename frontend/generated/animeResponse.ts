import type { TagsResponse, TranslationResponse } from '.';

export interface AnimeResponse {
  id: number;
  slug: string;
  age_rating: number;
  iframe_url: string | null;

  title?: string | null;
  description?: string | null;
  poster?: string | null;
  banner?: string | null;
  tags?: TagsResponse[] | null;
  translations?: TranslationResponse[] | null;
  blocked_countries?: string[] | null;
  year?: number | null;
  duration?: number | null;
  updated_at: string | null;
  created_at: string | null;
  screenshots: string[] | null;
  seasons?: [] | null;
  countries?: string | null;
  type?: string | null;

  anime_studios?: string | null;
  anime_status?: string | null;

  kinopoisk_rating?: number | null;
  shikimori_rating?: number | null;
}
