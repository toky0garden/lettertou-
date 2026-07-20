'use client';

import type { ResponseError } from '@siberiacancode/fetches';
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { toast } from 'sonner';

interface QueryProviderProps {
  children: React.ReactNode;
}

const getErrorMessage = (error: Error) => {
  const responseError = error.cause as ResponseError | undefined;
  if (responseError?.response?.statusText) return responseError.response.statusText;
  if (error.message === 'Failed to fetch') return 'Не удалось подключиться к серверу';
  return error.message || 'Ошибка запроса';
};

const showErrorToast = (error: Error) => {
  const message = getErrorMessage(error);

  toast.error(message, {
    id: message,
    cancel: { label: 'Закрыть', onClick: () => {} }
  });
};

export const QueryProvider: React.FC<QueryProviderProps> = ({ children }) => {
  const queryClient = React.useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { refetchOnWindowFocus: false, retry: false }
        },
        queryCache: new QueryCache({
          onError: showErrorToast
        }),
        mutationCache: new MutationCache({
          onError: showErrorToast
        })
      }),
    []
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};
