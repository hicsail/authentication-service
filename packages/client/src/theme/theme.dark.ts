import { createTheme } from '@mui/material';
import { themeBase } from './theme.base';

export const themeDark = createTheme({
  ...themeBase,
  palette: {
    mode: 'dark'
  }
});
