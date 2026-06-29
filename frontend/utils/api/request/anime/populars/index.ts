import { SwiperResponse } from '@/generated';
import { api } from '@/utils/api/instance';

export const getSwiper = ({ params, config }: RequestConfig) =>
  api.get<SwiperResponse[]>('/populars', { params, ...config });
