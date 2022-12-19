import { createTheme } from '@mui/material';
import { themeBase } from './theme.base';

export const themeLight = createTheme({
  ...themeBase,
  palette: {
    mode: 'light'
  }
});
