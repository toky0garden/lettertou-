import fetches from '@siberiacancode/fetches';

const backendUrl = (process.env.BACKEND_URL || 'http://localhost:8000').replace(/\/$/, '');

export const api = fetches.create({
  baseURL: typeof window === 'undefined' ? backendUrl : '/api'
});

api.interceptors.request.use((config) => ({
  ...config,
  credentials: 'include'
}));
