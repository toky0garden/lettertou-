import type { FetchesRequestConfig } from '@siberiacancode/fetches';
import type { LoginRequest, UserResponse } from '@/generated';
import { api } from '@/utils/api/instance';

export type PostLoginParams = LoginRequest;

export type PostLoginRequestConfig = FetchesRequestConfig<PostLoginParams>;

export const postLogin = ({ config, params }: PostLoginRequestConfig) =>
  api.post<UserResponse>('/auth/login', params, config);
