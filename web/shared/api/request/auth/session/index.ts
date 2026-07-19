import type { FetchesRequestConfig } from '@siberiacancode/fetches';
import type { UserResponse } from '@/generated';
import { api } from '@/utils/api/instance';

export const getCurrentUser = ({ config }: FetchesRequestConfig = {}) =>
  api.get<UserResponse>('/auth/me', config);

export const postLogout = ({ config }: FetchesRequestConfig = {}) =>
  api.post<void>('/auth/logout', undefined, config);
