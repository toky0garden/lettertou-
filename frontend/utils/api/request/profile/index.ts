import type { FetchesRequestConfig } from '@siberiacancode/fetches';
import type { BaseResponse, ProfileUserParams } from '@/generated';
import { api } from '../../instance';

export type GetProfileParams = ProfileUserParams;

export type GetProfileRequestConfig = FetchesRequestConfig<GetProfileParams>;

export const getProfile = ({ config, params }: GetProfileRequestConfig) => {
  api.get<BaseResponse>(`/profile/${params.username}`, {
    ...params,
    ...config
  });
};
