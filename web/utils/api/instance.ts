import fetches from '@siberiacancode/fetches';

export const api = fetches.create({
  baseURL: 'http://localhost:8000/api'
});

api.interceptors.request.use((config) => ({
  ...config,
  credentials: 'include'
}));
