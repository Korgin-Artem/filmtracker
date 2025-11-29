export const APP_CONFIG = {
  API_BASE_URL: 'http://127.0.0.1:8000/api',
  APP_NAME: 'FilmTracker',
  DEFAULT_PAGE_SIZE: 20,
  RATING_OPTIONS: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  WATCH_STATUS: {
    PLANNED: 'planned',
    WATCHING: 'watching', 
    WATCHED: 'watched'
  },
  WATCH_STATUS_LABELS: {
    planned: 'Запланировано',
    watching: 'Смотрю',
    watched: 'Просмотрено'
  },
  GENRE_COLORS: {
    'Фантастика': '#4fc3f7',
    'Драма': '#ffb74d',
    'Комедия': '#81c784',
    'Боевик': '#f44336',
    'Триллер': '#ba68c8',
    'Ужасы': '#78909c',
    'Мелодрама': '#f48fb1',
    'Приключения': '#4db6ac',
    'Фэнтези': '#ffd54f',
    'Детектив': '#8d6e63'
  }
};