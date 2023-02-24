import React, { FC } from 'react';
import { Drawer, Toolbar } from '@mui/material';
import { SideList } from '@components/side-bar/side-list';

const drawerWidth = 240;

export interface SideBarProps {
  children: React.ReactNode;
}

export const SideBar: FC<SideBarProps> = ({ children }) => {
  return (
    <Drawer
      anchor="left"
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' }
      }}
    >
      <Toolbar />
      <SideList>{children}</SideList>
    </Drawer>
  );
};
