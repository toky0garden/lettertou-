export const ROUTES = {
  ROOT: '/',
  EXTENDED_SEARCH: '/catalog/search',
  CATALOG: '/catalog',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  ANIME: (slug: string) => `/anime/title/${slug}`,
  PROFILE: (username: string) => `/profile/${username}`,
  GENRE: (name: string) => `/catalog/genre/${name}`
};
