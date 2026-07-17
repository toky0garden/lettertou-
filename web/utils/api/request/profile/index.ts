import type { FetchesRequestConfig } from '@siberiacancode/fetches';
import type { ProfileUserParams, PublicUserResponse, UserResponse } from '@/generated';
import { api } from '../../instance';

export type GetProfileParams = ProfileUserParams;

export type GetProfileRequestConfig = FetchesRequestConfig<GetProfileParams>;

export interface UpdateProfileParams {
  email?: string;
  current_password?: string;
  new_password?: string;
}

export const getProfile = ({ config, params }: GetProfileRequestConfig) => {
  return api.get<PublicUserResponse>(`/profile/${encodeURIComponent(params.username)}`, config);
};

export const updateProfile = ({ config, params }: FetchesRequestConfig<UpdateProfileParams>) =>
  api.patch<UserResponse>('/profile/me', params, config);

export const uploadProfileImage = (
  imageType: 'avatar' | 'banner',
  image: File,
  config?: FetchesRequestConfig['config']
) => {
  const body = new FormData();
  body.append('image', image);
  return api.post<UserResponse>(`/profile/me/${imageType}`, body, config);
};
