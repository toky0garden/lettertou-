import type { FetchesRequestConfig } from '@siberiacancode/fetches';
import type { SwiperResponse } from '@/generated';
import { api } from '@/utils/api/instance';

export const getUpdates = ({ config }: RequestConfig = {}) =>
  api.get<SwiperResponse[]>('/updates', config);
