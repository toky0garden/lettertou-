import type { GetAnimePlayerParams } from '../request';
import { useQuery } from '@tanstack/react-query';
import { getAnimePlayer } from '../request';

export const useGetAnimePlayer = (
  params: GetAnimePlayerParams,
  settings?: QuerySettings<typeof getAnimePlayer>
) =>
  useQuery({
    queryKey: ['getAnimePlayer', params.slug],
    queryFn: () => getAnimePlayer({ params, config: settings?.config }),
    enabled: !!params.slug,
    ...settings?.options
  });
