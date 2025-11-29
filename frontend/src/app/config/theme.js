import { createTheme } from '@mui/material/styles';

// Темная тема согласно дизайну из ТЗ
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#E50914', // Алый цвет как в Netflix/Kinopoisk
      light: '#ff5252',
      dark: '#b2102f',
    },
    secondary: {
      main: '#ffffff',
    },
    background: {
      default: '#121212', // Угольный фон
      paper: '#1e1e1e',   // Темно-серый для карточек
    },
    text: {
      primary: '#ffffff',  // Белый основной текст
      secondary: '#b3b3b3', // Серый второстепенный
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h5: {
      fontWeight: 500,
      fontSize: '1.25rem',
    },
    h6: {
      fontWeight: 500,
      fontSize: '1.1rem',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundImage: 'none',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#1e1e1e',
        },
      },
    },
  },
});

export default theme;