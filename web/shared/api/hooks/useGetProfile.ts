import type { GetProfileParams } from '../request';
import { useQuery } from '@tanstack/react-query';
import { getProfile } from '../request';

export const useGetProfile = (
  params: GetProfileParams,
  settings: QuerySettings<typeof getProfile>
) =>
  useQuery({
    queryKey: ['getProfile', params.id],
    queryFn: () => getProfile({ params, config: settings?.config }),
    ...settings?.options
  });
