import type { GetAnimeTranslationParams } from '../request';
import { useQuery } from '@tanstack/react-query';
import { getAnimeTranslation } from '../request';

export const useGetAnimeTranslation = (
  params: GetAnimeTranslationParams,
  settings?: QuerySettings<typeof getAnimeTranslation>
) =>
  useQuery({
    queryKey: ['getAnimeTranslation', params.shikiId, params.translationId],
    queryFn: () => getAnimeTranslation({ params, config: settings?.config }),
    enabled: !!params.shikiId && !!params.translationId,
    ...settings?.options
  });
