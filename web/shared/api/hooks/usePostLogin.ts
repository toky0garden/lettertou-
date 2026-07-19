import type { PostLoginRequestConfig } from '../request/auth/login';
import { useMutation } from '@tanstack/react-query';
import { postLogin } from '../request/auth/login';

export const useLogin = (settings?: MutationSettings<PostLoginRequestConfig>) =>
  useMutation({
    mutationKey: ['postLogin'],
    mutationFn: ({ params, config }) =>
      postLogin({ params, config: { ...settings?.config, ...config } }),
    ...settings?.options
  });
