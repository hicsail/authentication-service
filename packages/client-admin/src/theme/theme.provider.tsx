import React, { FC } from 'react';
import { CssBaseline } from '@mui/material';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { themeLight } from './theme.light';
import { themeDark } from './theme.dark';
import { useSettings } from '@context/settings.context';

export type ThemeType = 'light' | 'dark';

export interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: FC<ThemeProviderProps> = ({ children }) => {
  const {
    settings: { theme }
  } = useSettings();

  const selectedTheme = theme === 'light' ? themeLight : themeDark;

  return (
    <MuiThemeProvider theme={selectedTheme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
};
