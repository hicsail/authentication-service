import { FC } from 'react';
import { AppBar, Toolbar } from '@mui/material';

export const Header: FC = () => {
  return (
    <AppBar position="fixed" elevation={0} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar></Toolbar>
    </AppBar>
  );
};
