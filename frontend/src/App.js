import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { StyledEngineProvider } from '@mui/material/styles';
import theme from './app/config/theme';
import globalStyles from './app/config/globalStyles';
import AppRouter from './app/router/AppRouter';

function App() {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {globalStyles}
        <AppRouter />
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default App;