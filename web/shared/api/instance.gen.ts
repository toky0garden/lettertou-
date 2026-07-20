import fetches from '@siberiacancode/fetches';

// On the server there is no proxy, so talk to the backend directly.
// In the browser we go through the Next.js rewrite ("/api/:path*" -> backend)
// so that the session cookie is same-origin and actually gets sent.
const backendUrl = (process.env.BACKEND_URL || 'http://localhost:8000').replace(/\/$/, '');

export const instance = fetches.create({
  baseURL: 'https://lettertou-backend.vercel.app'
});

instance.interceptors.request.use((config) => ({
  ...config,
  credentials: 'include'
}));

// The backend always returns errors as {"detail": "..."}, but fetches builds
// ResponseError with message = response.statusText (empty under HTTP/2).
// Extract the human-readable detail so toast notifications are never blank.
instance.interceptors.response.use(undefined, (error) => {
  const detail = error.response?.data?.detail;
  if (typeof detail === 'string' && detail) {
    error.message = detail;
  }
  throw error;
});
