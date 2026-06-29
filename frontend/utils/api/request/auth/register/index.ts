import type { FetchesRequestConfig } from '@siberiacancode/fetches';
import type { RegisterRequest, UserResponse } from '@/generated';
import { api } from '@/utils/api/instance';

export type PostRegisterParams = RegisterRequest;

export type PostRegisterRequestConfig = FetchesRequestConfig<PostRegisterParams>;

export const postRegister = ({ config, params }: PostRegisterRequestConfig) => {
  const response = api.post<UserResponse>('/auth/register', params, config);
  console.log(response);
  return response;
};
