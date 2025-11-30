export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  CATALOG: '/catalog',
  MOVIE_DETAIL: '/movie/:id',
  SERIES_DETAIL: '/series/:id',
  PROFILE: '/profile',
  RECOMMENDATIONS: '/recommendations',
  ADMIN: '/admin',
};

export const getMovieDetailUrl = (id) => `/movie/${id}`;
export const getSeriesDetailUrl = (id) => `/series/${id}`;