'use client';

import type { ResponseError } from '@siberiacancode/fetches';
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { toast } from 'sonner';

interface QueryProviderProps {
  children: React.ReactNode;
}

export const QueryProvider: React.FC<QueryProviderProps> = ({ children }) => {
  const queryClient = React.useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { refetchOnWindowFocus: false, retry: false }
        },
        queryCache: new QueryCache({
          onError: (error) => {
            const responseError = error.cause as ResponseError;

            toast.error(responseError.response.statusText, {
              cancel: { label: 'Close', onClick: () => {} }
            });
          }
        }),
        mutationCache: new MutationCache({
          onError: (error) => {
            const responseError = error.cause as ResponseError;

            toast.error(responseError.response.statusText, {
              cancel: { label: 'Close', onClick: () => {} }
            });
          }
        })
      }),
    []
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};
