import { Box } from '@mui/material';
import { useEffect } from 'react';
import { useAuth } from '../context/auth.context';

export const Callback = () => {
  const { token, setToken } = useAuth();

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get('token');
    const newToken = token ? { token: token } : { token: '' };
    setToken(newToken);

    window.location.replace('https://herewecode.io/');
  }, []);

  return <Box>Callback</Box>;
};
