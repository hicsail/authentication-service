import { Box, Container } from '@mui/material';
import React, { FC } from 'react';
import { useSettings } from '@context/settings.context';
import { Header } from '@components/header';
import { SideBar } from '@components/side-bar/side-bar';
import { SideListItem } from '@components/side-bar/side-list-item';
import { Paths } from '@constants/paths';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers } from '@fortawesome/free-solid-svg-icons';

export interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: FC<LayoutProps> = ({ children }) => {
  const { settings, setSettings } = useSettings();

  const toggleDarkMode = () => {
    setSettings({ ...settings, theme: settings.theme === 'light' ? 'dark' : 'light' });
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Header />
      <SideBar>
        <SideListItem nodeId={Paths.USER_LIST} label="Users" path={Paths.USER_LIST} icon={<FontAwesomeIcon icon={faUsers} />} />
        <SideListItem nodeId={Paths.HOME} label="Home" path={Paths.HOME} icon={<FontAwesomeIcon icon={faUsers} />} />
      </SideBar>
      <Box sx={{ flexGrow: 1 }}>
        <Container sx={{ mt: 4 }}>{children}</Container>
      </Box>
    </Box>
  );
};
