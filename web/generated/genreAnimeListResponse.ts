import type { SwiperResponse } from '.';

export interface GenreAnimeListResponse {
  results: SwiperResponse[];
  next_page: string | null;
}
