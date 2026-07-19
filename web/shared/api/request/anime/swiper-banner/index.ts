import type { SwiperBannerResponse } from '@/generated';
import { api } from '../../../instance';

export const getSwiperBanner = ({ params, config }: RequestConfig) =>
  api.get<SwiperBannerResponse[]>('/banner', { params, ...config });
