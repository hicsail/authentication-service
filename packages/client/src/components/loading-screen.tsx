import { FC, ReactNode } from 'react';
import { CircularProgress, Stack } from '@mui/material';

export interface LoadingScreenProps {
  children?: ReactNode;
}

export const LoadingScreen: FC<LoadingScreenProps> = ({ children }) => {
  return (
    <Stack
      spacing={4}
      sx={{
        mt: 10,
        height: '100%',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <CircularProgress size={64} />
      {children}
    </Stack>
  );
};
