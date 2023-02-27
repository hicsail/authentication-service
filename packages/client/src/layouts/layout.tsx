import { DarkMode, GitHub, LightMode } from '@mui/icons-material';
import { AppBar, Avatar, Box, IconButton, Toolbar, Typography } from '@mui/material';
import React, { FC } from 'react';
import { useSettings } from '@context/settings.context';

export interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: FC<LayoutProps> = ({ children }) => {
  const { settings, setSettings } = useSettings();

  const toggleDarkMode = () => {
    setSettings({ ...settings, theme: settings.theme === 'light' ? 'dark' : 'light' });
  };

  return (
    <Box
      sx={{
        minHeight: `100vh`
      }}
    >
      <AppBar elevation={0} color="transparent" position="sticky">
        <Toolbar sx={{ justifyContent: 'end' }}>
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDarkMode}>
            {settings.theme === 'light' && <DarkMode color="info" />}
            {settings.theme === 'dark' && <LightMode color="warning" />}
          </IconButton>
        </Toolbar>
      </AppBar>
      {children}
      <Box
        component="footer"
        sx={{
          display: 'flex',
          zIndex: 10,
          alignItems: 'center',
          justifyContent: 'center',
          position: 'fixed',
          bottom: 0
        }}
      >
        <Toolbar sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', width: '100vw' }}>
          <Box
            component="a"
            sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', textDecoration: 'none', color: 'inherit', flexGrow: 1 }}
            target="_blank"
            href="https://sail.bu.edu"
          >
            <Avatar sx={{ width: 36, height: 36, mr: 1 }} src="https://sail.codes/img/s_logo.png" />
            <Typography component="span" variant="h5">
              SAIL
            </Typography>
          </Box>
          <IconButton href="https://github.com/hicsail" target="_blank">
            <GitHub />
          </IconButton>
        </Toolbar>
      </Box>
    </Box>
  );
};
