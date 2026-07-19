export interface PlayerTranslationResponse {
  id: number;
  title: string;
  type?: string | null;
  quality?: string | null;
  episodes_count?: number | null;
}

export interface PlayerResponse {
  shikimori_id: number | null;
  iframe_url: string;
  translations: PlayerTranslationResponse[];
}
