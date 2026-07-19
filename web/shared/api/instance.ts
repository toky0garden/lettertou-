import fetches from '@siberiacancode/fetches';

const backendUrl = (process.env.BACKEND_URL || 'http://localhost:8000').replace(/\/$/, '');

export const api = fetches.create({
  baseURL: typeof window === 'undefined' ? backendUrl : '/api'
});

api.interceptors.request.use((config) => ({
  ...config,
  credentials: 'include'
}));

// The backend always returns errors as {"detail": "..."}, but fetches builds
// ResponseError with message = response.statusText (empty under HTTP/2).
// Extract the human-readable detail so toast notifications are never blank.
api.interceptors.response.use(undefined, (error) => {
  const detail = error.response?.data?.detail;
  if (typeof detail === 'string' && detail) {
    error.message = detail;
  }
  throw error;
});
