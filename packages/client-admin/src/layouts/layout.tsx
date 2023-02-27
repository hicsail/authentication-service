import { Box } from '@mui/material';
import React, { FC } from 'react';

export interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <Box
      sx={{
        minHeight: `100vh`
      }}
    >
      {children}
    </Box>
  );
};
